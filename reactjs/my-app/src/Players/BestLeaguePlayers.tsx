import { useMemo, useState } from 'react';

import { Box, Card, CardContent, CardHeader, Grid, Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IApiFetchMatchLineups, fetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import { IMatchLineup } from '../Interfaces/match'
import { IBattingStatsExtended } from '../Interfaces/stats'
import { ILeague } from '../Interfaces/league';
import { IPlayer } from '../Interfaces/player';

import LoaderInfo from '../Generic/LoaderInfo';

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats } from '../utils/statsAggregation';



interface IBestLeaguePlayersProps {
  league: ILeague;
}

function BestLeaguePlayers(props: IBestLeaguePlayersProps) {
  const {league} = props;

  const [apiError, changeApiError] = useState("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [playersStats, setPlayersStats] = useState<IBattingStatsExtended[]>([]);
  const [listPlayers, setListPlayers] = useState<IPlayer[]>([]);

  /**
   * Fetch All players stats for this league
   */
  useMemo(() => {
    setIsLoaded(false);
    const paramsMatchLineups: IApiFetchMatchLineups = {
      leagueIds: [league.id],
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        const listMatchLineups: IMatchLineup[] = response.data;
        const playersStats = getCombinedPlayersStats(listMatchLineups)
        setPlayersStats(playersStats);
        if( playersStats.length === 0 ){
          setIsLoaded(true);
        }
      })
      .catch(error => {
        setIsLoaded(true);
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[league])

  /**
   * Fetch Players Information about the best players found
   */
  useMemo(() => {
    if( playersStats.length === 0 ) return;
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: playersStats.map((playerStats) => playerStats.id),
      leagueIds: [league.id]
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        setListPlayers(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, [league.id, playersStats])


  const bestBattingAverage = [...playersStats].sort((a, b) => b.battingAverage - a.battingAverage).slice(0, 5);
  const bestSluggers = [...playersStats].sort((a, b) => b.sluggingPercentage - a.sluggingPercentage).slice(0, 5);
  const bestRBI = [...playersStats].sort((a, b) => b.runsBattedIn - a.runsBattedIn).slice(0, 5);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      { isLoaded && playersStats.length > 0 && listPlayers.length > 0 && (
        <Paper component={Box} p={3} m={3}>
          <Typography variant="h1" textAlign="center">
            Best {league.name} Players
          </Typography>
          
          <Grid container columnGap={3} rowGap={3} justifyContent="space-between" 
            flexDirection={{xs:"column", lg:"row"}}
            alignItems={{xs:"flex-start", lg:"stretch"}}
          >
            <Grid item xs={12} lg component={Card} width="100%">
              <CardHeader
                title="Sluggers"
                titleTypographyProps={{variant:'h2'}}
              />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell align="center">SLG</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { bestSluggers.map((statPlayer) => (
                        <TableRow key={`best-player-stat-${statPlayer.id}`}>
                          <TableCell>{getPlayerName(statPlayer.id, listPlayers)}</TableCell>
                          <TableCell align="center">{statPlayer.sluggingPercentage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Grid>

            <Grid item xs={12} lg component={Card} width="100%">
              <CardHeader
                title="RBI"
                titleTypographyProps={{variant:'h2'}}
              />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell align="center">RBI</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { bestRBI.map((statPlayer) => (
                        <TableRow key={`best-player-stat-${statPlayer.id}`}>
                          <TableCell>{getPlayerName(statPlayer.id, listPlayers)}</TableCell>
                          <TableCell align="center">{statPlayer.runsBattedIn}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </CardContent>
            </Grid>

            <Grid item xs={12} lg component={Card} width="100%">
              <CardHeader
                title="Batting Average"
                titleTypographyProps={{variant:'h2'}}
              />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell align="center">%</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { bestBattingAverage.map((statPlayer) => (
                        <TableRow key={`best-player-stat-${statPlayer.id}`}>
                          <TableCell>{getPlayerName(statPlayer.id, listPlayers)}</TableCell>
                          <TableCell align="center">{statPlayer.battingAverage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </CardContent>
            </Grid>
          </Grid>
        </Paper>
      )} 
    </>
  )
}

export default BestLeaguePlayers;