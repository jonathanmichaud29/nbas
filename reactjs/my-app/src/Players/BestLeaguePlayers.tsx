import { useEffect, useState } from 'react';
import { batch } from 'react-redux';

import { Alert, Box, Card, CardContent, CardHeader, Grid, Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IMatchLineup } from '../Interfaces/match'
import { IBattingStatsExtended } from '../Interfaces/stats'
import { ILeagueSeason } from '../Interfaces/league';
import { IPlayer } from '../Interfaces/player';

import { IApiFetchMatchLineups, fetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import LoaderInfo from '../Generic/LoaderInfo';

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats } from '../utils/statsAggregation';



interface IBestLeaguePlayersProps {
  leagueSeason: ILeagueSeason;
}

function BestLeaguePlayers(props: IBestLeaguePlayersProps) {
  const { leagueSeason } = props;

  const [apiError, changeApiError] = useState("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [playersStats, setPlayersStats] = useState<IBattingStatsExtended[]>([]);
  const [listPlayers, setListPlayers] = useState<IPlayer[]>([]);

  /**
   * Fetch All players and their stats for this league season
   */
  useEffect(() => {
    const paramsMatchLineups: IApiFetchMatchLineups = {
      leagueSeasonIds: [leagueSeason.id],
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        const listMatchLineups: IMatchLineup[] = response.data;
        const newPlayersStats = getCombinedPlayersStats(listMatchLineups)
        
        const paramsFetchPlayers: IApiFetchPlayersParams = {
          playerIds: newPlayersStats.map((playerStats) => playerStats.id)
        }
        fetchPlayers(paramsFetchPlayers)
          .then(response => {
            batch(()=>{
              const newListPlayers: IPlayer[] = response.data;
              setPlayersStats(newPlayersStats);
              setListPlayers(newListPlayers);
            })
            
          })
          .catch(error => {
            changeApiError(error);
          })
          .finally(() => {
            setIsLoaded(true);
          });

      })
      .catch(error => {
        changeApiError(error);
        setIsLoaded(true);
      })
      .finally(() => {
        
      });
  },[leagueSeason])



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
      
      { isLoaded ? (
        <Paper component={Box} p={3} m={3}>
          <Typography variant="h1" textAlign="center">
            Best League Players
          </Typography>
          
          <Grid container columnGap={3} rowGap={3} justifyContent="space-between" 
            flexDirection={{xs:"column", lg:"row"}}
            alignItems={{xs:"flex-start", lg:"stretch"}}
          >
            <Grid item xs={12} lg component={Card} width="100%">
              { bestSluggers.length > 0 ? (
                <>
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
                </>
              ) : (
                <Alert severity='info'>There is no slugger stats</Alert> 
              ) }
            </Grid>

            <Grid item xs={12} lg component={Card} width="100%">
              { bestRBI.length > 0 ? (
                <>
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
                </>
              ) : (
                <Alert severity='info'>There is no RBI stats</Alert> 
              ) }
            </Grid>

            <Grid item xs={12} lg component={Card} width="100%">
              { bestBattingAverage.length > 0 ? (
                <>
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
                </>
              ) : (
                <Alert severity='info'>There is no Batting Average stats</Alert> 
              ) }
            </Grid>
          </Grid>
        </Paper>
      ) : ''} 
    </>
  )
}

export default BestLeaguePlayers;