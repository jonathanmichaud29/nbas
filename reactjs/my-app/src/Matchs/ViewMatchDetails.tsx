
import { useEffect, useMemo, useState } from 'react';
import { batch } from 'react-redux';

import { Alert, Box, Button, Paper, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { useAdminData } from '../Public/PublicApp';

import { IStandingTeam } from '../Interfaces/team'
import { IMatchDetailsProps } from '../Interfaces/match'
import { IBattingStatsExtended, defaultBattingStatsExtended } from '../Interfaces/stats';

import { fetchStandingTeams, IApiFetchStandingTeamsParams } from '../ApiCall/teams';

import Scoreboard from './Scoreboard';
import LoaderInfo from '../Generic/LoaderInfo';
import CustomDataGrid from '../Generic/CustomDataGrid';
import MatchTeamStats from './MatchTeamStats';

import { filterTeamLineups } from '../utils/dataFilter';
import { createDateReadable } from '../utils/dateFormatter';
import { setMetas } from '../utils/metaTags';
import { generateDatagridPlayerRows, getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation';
import { playerExtendedStatsColumns, defaultStateStatsColumns } from '../utils/dataGridColumns';



function ViewMatchDetails(props: IMatchDetailsProps) {

  const { matchEncounter } = props;
  
  const {isAdmin} = useAdminData();
  const [apiError, changeApiError] = useState("");
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[]>([]);

  const [matchRows, setMatchRows] = useState<Array<{}>>([]);
  const [homeRows, setHomeRows] = useState<Array<{}>>([]);
  const [awayRows, setAwayRows] = useState<Array<{}>>([]);
  
  const [teamHomeStats, setTeamHomeStats] = useState<IBattingStatsExtended | null>(null);
  const [teamAwayStats, setTeamAwayStats] = useState<IBattingStatsExtended | null>(null);

  
  const isLoaded =  ( matchEncounter && standingTeams !== null && teamHomeStats !== null && teamAwayStats !== null &&
    matchRows !== null && homeRows !== null && awayRows !== null ? true : false );


  useMemo(() => {
    
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
      title:`Match summary - ${matchEncounter.teamHome.name} receives ${matchEncounter.teamAway.name}`,
      description:`NBAS match summary ${matchEncounter.teamHome.name} receives ${matchEncounter.teamAway.name} on date ${createDateReadable(matchEncounter.match.date)}`
    });
  }, [matchEncounter])

  /**
   * Aggregate data for DataGrid and Charts
   */
  useEffect(() => {
    
    // Aggregate Match Data
    const allStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(matchEncounter.matchLineups);
    const matchRows = generateDatagridPlayerRows(allStats, matchEncounter.players);
    

    // Aggregate Home Team data
    const teamHomeLineups = filterTeamLineups(matchEncounter.matchLineups, matchEncounter.teamHome.id);
    teamHomeLineups.sort((a,b) => a.hitOrder - b.hitOrder);
    const homeTeamStats: IBattingStatsExtended = getCombinedTeamsStats(teamHomeLineups).find((battingStat) => battingStat.id !== undefined) || Object.assign({}, defaultBattingStatsExtended);
    const homePlayerStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(teamHomeLineups);
    const homeRows = generateDatagridPlayerRows(homePlayerStats, matchEncounter.players);
    
    
    // Aggregate Away Team data
    const teamAwayLineups = filterTeamLineups(matchEncounter.matchLineups, matchEncounter.teamAway.id);
    teamAwayLineups.sort((a,b) => a.hitOrder - b.hitOrder);
    const awayTeamStats: IBattingStatsExtended = getCombinedTeamsStats(teamAwayLineups).find((battingStat) => battingStat.id !== undefined) || Object.assign({}, defaultBattingStatsExtended);
    const awayPlayerStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(teamAwayLineups);
    const awayRows = generateDatagridPlayerRows(awayPlayerStats, matchEncounter.players);

    batch(() => {
      setMatchRows(matchRows);
      setHomeRows(homeRows);
      setAwayRows(awayRows);
      setTeamHomeStats(homeTeamStats);
      setTeamAwayStats(awayTeamStats);
    })
  }, [matchEncounter])



  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      { isLoaded ? (
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
      ) : ''}
      
      { teamHomeStats !== null && homeRows.length > 0 ? (
        <MatchTeamStats
          match={matchEncounter.match}
          team={matchEncounter.teamHome}
          teamStats={teamHomeStats}
          dataGridRows={homeRows}
        />
      ) : (
        <Alert severity='info'>No stats found for home team</Alert>
      )}

      { teamAwayStats !== null && awayRows.length > 0 ? (
        <MatchTeamStats
          match={matchEncounter.match}
          team={matchEncounter.teamAway}
          teamStats={teamAwayStats}
          dataGridRows={awayRows}
        />
      ) : (
        <Alert severity='info'>No stats found for away team</Alert>
      )}
    
    </>
  )
}

export default ViewMatchDetails;