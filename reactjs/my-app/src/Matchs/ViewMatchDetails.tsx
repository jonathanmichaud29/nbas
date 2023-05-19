
import { useEffect, useMemo, useState } from 'react';
import { batch } from 'react-redux';

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import { useAdminData } from '../Public/PublicApp';

import { IStandingTeam } from '../Interfaces/team'
import { IBattingStatsExtended } from '../Interfaces/stats';
import { IMatchEncounter } from '../Interfaces/match';

import { fetchStandingTeams, IApiFetchStandingTeamsParams } from '../ApiCall/teams';

import Scoreboard from './Scoreboard';
import LoaderInfo from '../Generic/LoaderInfo';
import CustomDataGrid from '../Generic/CustomDataGrid';
import MatchTeamStats from './MatchTeamStats';

import { filterTeamLineups } from '../utils/dataFilter';
import { generateDatagridPlayerRows, getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation';
import { playerExtendedStatsColumns, defaultStateStatsColumns } from '../utils/dataGridColumns';


interface IMatchDetailsProps {
  matchEncounter: IMatchEncounter;
}
function ViewMatchDetails(props: IMatchDetailsProps) {

  const { matchEncounter } = props;
  
  const {isAdmin} = useAdminData();
  const [apiError, changeApiError] = useState<string>("");
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const [matchRows, setMatchRows] = useState<Array<{}>>([]);
  const [homeRows, setHomeRows] = useState<Array<{}>>([]);
  const [awayRows, setAwayRows] = useState<Array<{}>>([]);
  
  const [teamHomeStats, setTeamHomeStats] = useState<IBattingStatsExtended | null>(null);
  const [teamAwayStats, setTeamAwayStats] = useState<IBattingStatsExtended | null>(null);


  /**
   * Fetch Teams Standing
   */
  useEffect(() => {
    let newError: string = '';
    let newStandingTeams: IStandingTeam[] = []
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: [matchEncounter.teamHome.id, matchEncounter.teamAway.id],
      seasonId: matchEncounter.match.idSeason
    }
    fetchStandingTeams(paramsFetchStandingTeams)
      .then(response => {
        newStandingTeams = response.data || []
        
      })
      .catch(error => {
        newError = error;
        
      })
      .finally(() => {
        batch(() => {
          setStandingTeams(newStandingTeams)
          changeApiError(newError);
          setDataLoaded(true);
        })
      });
  }, [matchEncounter])

  /**
   * Aggregate data for DataGrid and Charts
   */
  useMemo(() => {
    
    // Match Data
    const allStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(matchEncounter.matchLineups);
    const matchRows = generateDatagridPlayerRows(allStats, matchEncounter.players, matchEncounter.match.idSeason);
    

    // Home Team data
    const teamHomeLineups = filterTeamLineups(matchEncounter.matchLineups, matchEncounter.teamHome.id);
    teamHomeLineups.sort((a,b) => a.hitOrder - b.hitOrder);
    const homeTeamStats: IBattingStatsExtended | null = getCombinedTeamsStats(teamHomeLineups).find((battingStat) => battingStat.id !== undefined) || null;
    const homePlayerStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(teamHomeLineups);
    const homeRows = generateDatagridPlayerRows(homePlayerStats, matchEncounter.players, matchEncounter.match.idSeason);
    
    
    // Away Team data
    const teamAwayLineups = filterTeamLineups(matchEncounter.matchLineups, matchEncounter.teamAway.id);
    teamAwayLineups.sort((a,b) => a.hitOrder - b.hitOrder);
    const awayTeamStats: IBattingStatsExtended | null = getCombinedTeamsStats(teamAwayLineups).find((battingStat) => battingStat.id !== undefined) || null;
    const awayPlayerStats: Array<IBattingStatsExtended> = getCombinedPlayersStats(teamAwayLineups);
    const awayRows = generateDatagridPlayerRows(awayPlayerStats, matchEncounter.players, matchEncounter.match.idSeason);

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
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      { dataLoaded ? (
        <Paper component={Box} p={3} m={3}>
          <Stack spacing={3} alignItems="center" >
            <Scoreboard 
              match={matchEncounter.match}
              standingTeams={standingTeams}
              teamAway={matchEncounter.teamAway}
              teamHome={matchEncounter.teamHome}
              titleLevel={'h1'}
            />
            { isAdmin 
            ? 
              <Button 
                variant="contained" 
                startIcon={<EditIcon />} 
                href={`/admin/match/${matchEncounter.match.id}`}
              >Edit match</Button>
            : ''}
            { matchRows.length > 0 
            ? 
              <>
                <Typography variant="h2" textAlign="center">Match statistics</Typography>
                <CustomDataGrid
                  pageSize={10}
                  rows={matchRows}
                  columns={playerExtendedStatsColumns}
                  initialState={defaultStateStatsColumns}
                  getRowId={(row:any) => row.id + "-match-" + matchEncounter.match.id}
                />
              </>
            : ''}
          </Stack>
        </Paper>
      ) : ''}
      
      { dataLoaded
      ? 
        <>
          <MatchTeamStats
            match={matchEncounter.match}
            team={matchEncounter.teamHome}
            teamStats={teamHomeStats}
            dataGridRows={homeRows}
          />
          <MatchTeamStats
            match={matchEncounter.match}
            team={matchEncounter.teamAway}
            teamStats={teamAwayStats}
            dataGridRows={awayRows}
          />
        </>
      : ''}
    
    </>
  )
}

export default ViewMatchDetails;