import { useEffect, useState } from 'react';
import { batch } from 'react-redux';

import { Alert, Box, Card, CardContent, CardHeader, Grid, Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { usePublicContext } from '../Public/PublicApp';

import { IMatchLineup } from '../Interfaces/match'
import { IBattingStatsExtended } from '../Interfaces/stats'
import { ILeagueSeason } from '../Interfaces/league';

import { IApiFetchMatchLineups, fetchMatchLineups } from '../ApiCall/matches';

import LoaderInfo from '../Generic/LoaderInfo';

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats } from '../utils/statsAggregation';

interface IBestLeaguePlayersProps {
  leagueSeason: ILeagueSeason;
}

function BestLeaguePlayers(props: IBestLeaguePlayersProps) {
  const { leagueSeason } = props;

  const { leaguePlayers } = usePublicContext();

  const [apiError, changeApiError] = useState("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [playersStats, setPlayersStats] = useState<IBattingStatsExtended[]>([]);

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
        batch(() => {
          setPlayersStats(newPlayersStats);
          setDataLoaded(true);
        })
        
        
      })
      .catch(error => {
        batch(() => {
          changeApiError(error);
          setDataLoaded(true);
        })
        
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
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      { dataLoaded ? (
        <Paper component={Box} p={3} m={3}>
          <Typography variant="h1" textAlign="center" mb={3}>Best Season Players</Typography>
          <Grid container gap={3} justifyContent="space-between" 
            flexDirection={{xs:"column", lg:"row"}}
            alignItems={{xs:"flex-start", lg:"stretch"}}
          >
            <Grid item xs={12} lg width="100%">
              <Card raised={true}>
                <CardHeader
                  title="Sluggers"
                  titleTypographyProps={{variant:'h2'}}
                />
                <CardContent>
                  { bestSluggers.length > 0 ? (
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
                              <TableCell>{getPlayerName(statPlayer.id, leaguePlayers)}</TableCell>
                              <TableCell align="center">{statPlayer.sluggingPercentage}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity='info'>There is no slugger stats</Alert> 
                  ) }
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg width="100%">
              <Card raised={true}>
                <CardHeader
                  title="RBI"
                  titleTypographyProps={{variant:'h2'}}
                />
                <CardContent>
                  { bestRBI.length > 0 ? (
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
                              <TableCell>{getPlayerName(statPlayer.id, leaguePlayers)}</TableCell>
                              <TableCell align="center">{statPlayer.runsBattedIn}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity='info'>There is no RBI stats</Alert> 
                  ) }
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg width="100%">
              <Card raised={true}>
                <CardHeader
                  title="Batting Average"
                  titleTypographyProps={{variant:'h2'}}
                />
                <CardContent>
                  { bestRBI.length > 0 ? (
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
                              <TableCell>{getPlayerName(statPlayer.id, leaguePlayers)}</TableCell>
                              <TableCell align="center">{statPlayer.battingAverage}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity='info'>There is no Batting Average stats</Alert> 
                  ) }
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      ) : ''} 
    </>
  )
}

export default BestLeaguePlayers;