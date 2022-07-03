
import { useEffect, useState } from 'react';

import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


import { fetchMatchLineups } from '../ApiCall/matches';
import { fetchTeams, fetchStandingTeams, IApiFetchTeamsParams, IApiFetchStandingTeamsParams } from '../ApiCall/teams';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import { ITeam, IStandingTeam } from '../Interfaces/team'
import { IMatchDetailsProps, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'
import { IBattingStatsExtended, defaultBattingStatsExtended } from '../Interfaces/stats';

import { filterTeamLineups } from '../utils/dataFilter';
import { createDateReadable } from '../utils/dateFormatter';
import { setMetas } from '../utils/metaTags';
import { getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation';
import { getPlayerName } from '../utils/dataAssociation';
import { defaultDataGridProps, playerExtendedStatsColumns, defaultStateStatsColumns } from '../utils/dataGridColumns';

import Scoreboard from './Scoreboard';
import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';


function ViewMatchDetails(props: IMatchDetailsProps) {

  const { match } = props;

  const [apiError, changeApiError] = useState("");
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [players, setPlayers] = useState<IPlayer[] | null>(null);
  const [matchLineups, setMatchLineups] = useState<IMatchLineup[] | null>(null);
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[] | null>(null);

  const [matchRows, setMatchRows] = useState<Array<{}> | null>(null);
  const [homeRows, setHomeRows] = useState<Array<{}> | null>(null);
  const [awayRows, setAwayRows] = useState<Array<{}> | null>(null);
  
  const [teamHomeStats, setTeamHomeStats] = useState<IBattingStatsExtended | null>(null);
  const [teamAwayStats, setTeamAwayStats] = useState<IBattingStatsExtended | null>(null);

  const isLoaded =  matchLineups !== null && teamHome !== null && teamAway !== null && 
                    players !== null && standingTeams !== null && teamHomeStats !== null && teamAwayStats !== null &&
                    matchRows !== null && homeRows !== null && awayRows !== null;

  if( teamHome !== null && teamAway !== null ){
    setMetas({
      title:`Match summary - ${teamHome.name} vs ${teamAway.name}`,
      description:`NBAS match summary ${teamHome.name} vs ${teamAway.name} on date ${createDateReadable(match.date)}`
    });
  }

  useEffect(() => {
    if( matchLineups !== null && teamHome !== null && teamAway !== null ) return;
    fetchMatchLineups(match.id)
      .then((response) => {
        setMatchLineups(response.data);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
    
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [match.idTeamHome, match.idTeamAway]
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        response.data.forEach((team: ITeam) => {
          if ( team.id === match.idTeamHome) {
            setTeamHome(team);
          }
          else {
            setTeamAway(team);
          }
        })
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [matchLineups, match, teamAway, teamHome])

  useEffect(() => {
    if( matchLineups === null || players !== null) return;

    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: matchLineups.map((matchLineup) => matchLineup.idPlayer)
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        setPlayers(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [matchLineups, players])

  useEffect(() => {
    if( standingTeams !== null || match === null) return;
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: [match.idTeamHome, match.idTeamAway]
    }
    fetchStandingTeams(paramsFetchStandingTeams)
      .then(response => {
        setStandingTeams(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [match, standingTeams])


  useEffect(() => {
    if( teamHome === null || teamAway === null || matchLineups === null || teamHomeStats !== null || teamAwayStats !== null) return;

    // Add all stats from match lineups
    const teamHomeLineups = filterTeamLineups(matchLineups, teamHome.id);
    teamHomeLineups.sort((a,b) => a.hitOrder - b.hitOrder);

    const teamAwayLineups = filterTeamLineups(matchLineups, teamAway.id);
    teamAwayLineups.sort((a,b) => a.hitOrder - b.hitOrder);

    const homeStats: IBattingStatsExtended = getCombinedTeamsStats(teamHomeLineups).find((battingStat) => battingStat.id !== undefined) || defaultBattingStatsExtended;
    setTeamHomeStats(homeStats);

    const awayStats: IBattingStatsExtended = getCombinedTeamsStats(teamAwayLineups).find((battingStat) => battingStat.id !== undefined) || defaultBattingStatsExtended;
    setTeamAwayStats(awayStats);

    // Reorder lineups by hit Order
    
  }, [matchLineups, teamAway, teamAwayStats, teamHome, teamHomeStats])


  useEffect(() => {
    if( matchLineups === null || teamHome === null || teamAway === null || players === null) return;

    const allStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(matchLineups);
    /* setMatchStats(allStats); */

    const homeLineups = filterTeamLineups(matchLineups, teamHome.id)
    const homeStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(homeLineups);
    /* setPlayersHomeStats(homeStats); */

    const awayLineups = filterTeamLineups(matchLineups, teamAway.id)
    const awayStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(awayLineups);
    /* setPlayersHomeStats(awayStats); */

    const matchRows = ( allStats.map((playerStats) => {
      return {
        id: playerStats.id,
        playerName: getPlayerName(playerStats.id, players),
        atBats: playerStats.atBats,
        out: playerStats.out,
        single: playerStats.single,
        double: playerStats.double,
        triple: playerStats.triple,
        homerun: playerStats.homerun,
        runsBattedIn: playerStats.runsBattedIn,
        battingAverage: playerStats.battingAverage,
        onBasePercentage: playerStats.onBasePercentage,
        sluggingPercentage: playerStats.sluggingPercentage,
        onBaseSluggingPercentage: playerStats.onBaseSluggingPercentage,
      }
    }) );

    const homeRows = ( homeStats.map((playerStats) => {
      return {
        id: playerStats.id,
        playerName: getPlayerName(playerStats.id, players),
        atBats: playerStats.atBats,
        out: playerStats.out,
        single: playerStats.single,
        double: playerStats.double,
        triple: playerStats.triple,
        homerun: playerStats.homerun,
        runsBattedIn: playerStats.runsBattedIn,
        battingAverage: playerStats.battingAverage,
        onBasePercentage: playerStats.onBasePercentage,
        sluggingPercentage: playerStats.sluggingPercentage,
        onBaseSluggingPercentage: playerStats.onBaseSluggingPercentage,
      }
    }) );

    const awayRows = ( awayStats.map((playerStats) => {
      return {
        id: playerStats.id,
        playerName: getPlayerName(playerStats.id, players),
        atBats: playerStats.atBats,
        out: playerStats.out,
        single: playerStats.single,
        double: playerStats.double,
        triple: playerStats.triple,
        homerun: playerStats.homerun,
        runsBattedIn: playerStats.runsBattedIn,
        battingAverage: playerStats.battingAverage,
        onBasePercentage: playerStats.onBasePercentage,
        sluggingPercentage: playerStats.sluggingPercentage,
        onBaseSluggingPercentage: playerStats.onBaseSluggingPercentage,
      }
    }) );
    setMatchRows(matchRows);
    setHomeRows(homeRows);
    setAwayRows(awayRows);

  },[matchLineups, players, teamAway, teamHome])

  

  return (
    <>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      
        
      { isLoaded && (
        <Box p={3}>
          <Card>
            <CardContent>
              <Scoreboard 
                match={match}
                standingTeams={standingTeams}
                teamAway={teamAway}
                teamHome={teamHome}
              />
            </CardContent>
            { matchRows.length > 0 && (
              <CardContent>
                <Grid container>
                  <Grid item xs={12}>
                    <DataGrid
                      {...defaultDataGridProps}
                      rows={matchRows}
                      columns={playerExtendedStatsColumns}
                      getRowId={(row) => row.id + "-match-" + match.id}
                      initialState={defaultStateStatsColumns}
                      components={{
                        Toolbar: GridToolbar
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            )}
          </Card>
        </Box>
      )}
      
      { isLoaded && (
        <Box p={3}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Typography component="h3" variant="h5" align="center">
                    {teamHome.name} Stats
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatBatResults
                    single={teamHomeStats.single}
                    double={teamHomeStats.double}
                    triple={teamHomeStats.triple}
                    homerun={teamHomeStats.homerun}
                    out={teamHomeStats.out}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatBattingPercentage
                    stats={[teamHomeStats]}
                    columns={[`${teamHome.name} stats`]}
                  />
                </Grid>
                {homeRows.length > 0 && (
                  <Grid item xs={12}>
                    <DataGrid
                      {...defaultDataGridProps}
                      rows={homeRows}
                      columns={playerExtendedStatsColumns}
                      getRowId={(row) => row.id + "-home-" + match.id}
                      initialState={defaultStateStatsColumns}
                      components={{
                        Toolbar: GridToolbar
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      { isLoaded && (
        <Box p={3}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Typography component="h3" variant="h5" align="center">
                    {teamAway.name} Stats
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatBatResults
                    single={teamAwayStats.single}
                    double={teamAwayStats.double}
                    triple={teamAwayStats.triple}
                    homerun={teamAwayStats.homerun}
                    out={teamAwayStats.out}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatBattingPercentage
                    stats={[teamAwayStats]}
                    columns={[`${teamAway.name} stats`]}
                  />
                </Grid>
                {awayRows.length > 0 && (
                  <Grid item xs={12}>
                    <DataGrid
                      {...defaultDataGridProps}
                      rows={awayRows}
                      columns={playerExtendedStatsColumns}
                      getRowId={(row) => row.id + "-away-" + match.id}
                      initialState={defaultStateStatsColumns}
                      components={{
                        Toolbar: GridToolbar
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    
    </>
  )
}

export default ViewMatchDetails;