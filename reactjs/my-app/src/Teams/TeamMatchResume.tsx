import { useState, useEffect} from 'react';

import { Box, Card, CardContent, Grid, Stack } from "@mui/material";

import { ITeamMatchResumeProps } from '../Interfaces/team';
import { IBattingStatsExtended, defaultBattingStatsExtended } from "../Interfaces/stats";

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';
import Scoreboard from "../Matchs/Scoreboard";
import CustomDataGrid from '../Generic/CustomDataGrid';

import { generateDatagridPlayerRows, getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation';
import { playerExtendedStatsColumns, defaultStateStatsColumns } from '../utils/dataGridColumns'
import { batch } from 'react-redux';


function TeamMatchResume(props: ITeamMatchResumeProps) {

  const {matchLineups, match, players, teamHome, teamAway} = props;

  const [allStats, setAllStats] = useState<IBattingStatsExtended>(defaultBattingStatsExtended);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  matchLineups.sort((a,b) => a.hitOrder - b.hitOrder);
  const playersStats = getCombinedPlayersStats(matchLineups);
  const rows = generateDatagridPlayerRows(playersStats, players, match.idSeason)

  useEffect(() => {
    // Add all stats from match lineups
    const teamStats: IBattingStatsExtended = getCombinedTeamsStats(matchLineups).find((battingStat) => battingStat.id !== undefined) || Object.assign({}, defaultBattingStatsExtended);
    batch(() => {
      setAllStats(teamStats);
      setDataLoaded(true);
    })
    
  }, [matchLineups])

  
  
  if( ! dataLoaded ){ return (<></>)}
  return (
    <Card raised={true} component={Box} width="100%">
      <CardContent component={Stack} spacing={3} alignItems="center" width="100%">
        <Scoreboard
          match={match}
          teamHome={teamHome}
          teamAway={teamAway}
          hasLinkMatchDetails={true}
        />
        { match.isCompleted === 1 ? (
          <Grid container>
            <Grid item xs={12} sm={6}>
              <StatBatResults
                single={allStats.single}
                double={allStats.double}
                triple={allStats.triple}
                homerun={allStats.homerun}
                out={allStats.out}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatBattingPercentage
                stats={[allStats]}
                columns={["team stats"]}
              />
            </Grid>
          </Grid>
        ) : ''}

        { match.isCompleted === 1 && rows.length > 0 ? (
          <CustomDataGrid
            pageSize={5}
            rows={rows}
            columns={playerExtendedStatsColumns}
            initialState={defaultStateStatsColumns}
            getRowId={(row:any) => row.id + "-match-" + match.id}
          />
        ) : ''}
      </CardContent>
    </Card>
  )
}

export default TeamMatchResume;