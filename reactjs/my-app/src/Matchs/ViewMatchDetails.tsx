
import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Paper, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { fetchMatchLineups, IApiFetchMatchLineups } from '../ApiCall/matches';
import { fetchTeams, fetchStandingTeams, IApiFetchTeamsParams, IApiFetchStandingTeamsParams } from '../ApiCall/teams';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import { ITeam, IStandingTeam } from '../Interfaces/team'
import { IMatchDetailsProps, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'
import { IBattingStatsExtended, defaultBattingStatsExtended } from '../Interfaces/stats';

import Scoreboard from './Scoreboard';
import LoaderInfo from '../Generic/LoaderInfo';
import CustomDataGrid from '../Generic/CustomDataGrid';
import { useAdminData } from '../Public/PublicApp';
import MatchTeamStats from './MatchTeamStats';

import { filterTeamLineups } from '../utils/dataFilter';
import { createDateReadable } from '../utils/dateFormatter';
import { setMetas } from '../utils/metaTags';
import { getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation';
import { getPlayerName } from '../utils/dataAssociation';
import { playerExtendedStatsColumns, defaultStateStatsColumns } from '../utils/dataGridColumns';

function ViewMatchDetails(props: IMatchDetailsProps) {

  const { matchEncounter } = props;
  
  const {isAdmin} = useAdminData();
  const [apiError, changeApiError] = useState("");
  /*
  const [teamHome, setTeamHome] = useState<ITeam>();
  const [teamAway, setTeamAway] = useState<ITeam>();
  const [players, setPlayers] = useState<IPlayer[] | null>(null);
  const [matchLineups, setMatchLineups] = useState<IMatchLineup[] | null>(null); 
  */
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[]>([]);

  const [matchRows, setMatchRows] = useState<Array<{}>>([]);
  const [homeRows, setHomeRows] = useState<Array<{}>>([]);
  const [awayRows, setAwayRows] = useState<Array<{}>>([]);
  
  const [teamHomeStats, setTeamHomeStats] = useState<IBattingStatsExtended>();
  const [teamAwayStats, setTeamAwayStats] = useState<IBattingStatsExtended>();

  /* const isLoaded =  matchLineups !== null && teamHome !== null && teamAway !== null && 
                    players !== null && standingTeams !== null && teamHomeStats !== null && teamAwayStats !== null &&
                    matchRows !== null && homeRows !== null && awayRows !== null; */
  const isLoaded =  ( matchEncounter && standingTeams !== null && teamHomeStats !== null && teamAwayStats !== null &&
    matchRows !== null && homeRows !== null && awayRows !== null ? true : false );


  useMemo(() => {
    /**
     * Fetch Match Lineups
     */
    /* const paramsMatchLineups: IApiFetchMatchLineups = {
      matchId: match.id,
      leagueIds: [match.idLeague]
    }
    fetchMatchLineups(paramsMatchLineups)
      .then((response) => {
        setMatchLineups(response.data);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
     */
    /**
     * Fetch Match Teams
     */
    /* const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [match.idTeamHome, match.idTeamAway],
      leagueIds: [match.idLeague]
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
 */
    /**
     * Fetch Teams Standing
     */
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: [matchEncounter.teamHome.id, matchEncounter.teamAway.id],
      seasonId: matchEncounter.match.idSeason
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
  }, [matchEncounter])

  /**
   * Set Meta Tags values
   */
  useEffect(() => {
    if( ! matchEncounter.teamHome || ! matchEncounter.teamAway ) return;
    setMetas({
      title:`Match summary - ${matchEncounter.teamHome.name} vs ${matchEncounter.teamAway.name}`,
      description:`NBAS match summary ${matchEncounter.teamHome.name} vs ${matchEncounter.teamAway.name} on date ${createDateReadable(matchEncounter.match.date)}`
    });
  }, [matchEncounter])

  /**
   * Fetch Players in Match Lineups
   */
  /* useMemo(() => {
    if( matchLineups === null ) return;

    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: matchLineups.map((matchLineup) => matchLineup.idPlayer),
      leagueIds: [match.idLeague]
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
  }, [match, matchLineups]) */


  
  /**
   * Aggregate data for DataGrid and Charts
   */
  useMemo(() => {
    // if( matchLineups === null || teamHome === null || teamAway === null || players === null) return;
    
    // Aggregate Match Data
    const allStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(matchEncounter.matchLineups);
    const matchRows = ( allStats.map((playerStats) => {
      return {
        id: playerStats.id,
        playerName: getPlayerName(playerStats.id, matchEncounter.players),
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

    // Aggregate Home Team data
    const teamHomeLineups = filterTeamLineups(matchEncounter.matchLineups, matchEncounter.teamHome.id);
    teamHomeLineups.sort((a,b) => a.hitOrder - b.hitOrder);
    const homeTeamStats: IBattingStatsExtended = getCombinedTeamsStats(teamHomeLineups).find((battingStat) => battingStat.id !== undefined) || Object.assign({}, defaultBattingStatsExtended);
    const homePlayerStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(teamHomeLineups);
    setTeamHomeStats(homeTeamStats);


    const homeRows = ( homePlayerStats.map((playerStats) => {
      return {
        id: playerStats.id,
        playerName: getPlayerName(playerStats.id, matchEncounter.players),
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
    setHomeRows(homeRows);
    
    // Aggregate Away Team data
    const teamAwayLineups = filterTeamLineups(matchEncounter.matchLineups, matchEncounter.teamAway.id);
    teamAwayLineups.sort((a,b) => a.hitOrder - b.hitOrder);
    const awayTeamStats: IBattingStatsExtended = getCombinedTeamsStats(teamAwayLineups).find((battingStat) => battingStat.id !== undefined) || Object.assign({}, defaultBattingStatsExtended);
    const awayPlayerStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(teamAwayLineups);
    setTeamAwayStats(awayTeamStats);
    
    const awayRows = ( awayPlayerStats.map((playerStats) => {
      return {
        id: playerStats.id,
        playerName: getPlayerName(playerStats.id, matchEncounter.players),
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
    setAwayRows(awayRows);

  }, [matchEncounter/* matchLineups, teamAway, teamHome, players */])



  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      { isLoaded && (
        <Paper component={Box} p={3} m={3}>
          <Stack spacing={3} alignItems="center" >
            <Scoreboard 
              match={matchEncounter.match}
              standingTeams={standingTeams}
              teamAway={matchEncounter.teamAway}
              teamHome={matchEncounter.teamHome}
              titleLevel={'h1'}
            />
            { isAdmin && (
              <Button 
                variant="contained" 
                startIcon={<EditIcon />} 
                href={`/admin/match/${matchEncounter.match.id}`}
              >Edit match</Button>
            )}
            { matchRows.length > 0 && (
              <CustomDataGrid
                pageSize={10}
                rows={matchRows}
                columns={playerExtendedStatsColumns}
                initialState={defaultStateStatsColumns}
                getRowId={(row:any) => row.id + "-match-" + matchEncounter.match.id}
              />
            )}
          </Stack>
        </Paper>
      )}
      
      {/* { isLoaded && (
        <MatchTeamStats
          match={matchEncounter.match}
          team={matchEncounter.teamHome}
          teamStats={teamHomeStats}
          dataGridRows={homeRows}
        />
      )}

      { isLoaded && (
        <MatchTeamStats
          match={matchEncounter.match}
          team={matchEncounter.teamAway}
          teamStats={teamAwayStats}
          dataGridRows={awayRows}
        />
      )} */}
    
    </>
  )
}

export default ViewMatchDetails;