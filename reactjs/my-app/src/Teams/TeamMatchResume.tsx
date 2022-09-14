import { useState, useEffect} from 'react';

import { Grid, Stack } from "@mui/material";

import { ITeamMatchResumeProps } from '../Interfaces/team';
import { IBattingStatsExtended, defaultBattingStatsExtended } from "../Interfaces/stats";

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';
import Scoreboard from "../Matchs/Scoreboard";
import CustomDataGrid from '../Generic/CustomDataGrid';

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation';
import { playerExtendedStatsColumns, defaultStateStatsColumns } from '../utils/dataGridColumns'


function TeamMatchResume(props: ITeamMatchResumeProps) {

  const {matchLineups, match, players, teamHome, teamAway} = props;

  const [allStats, setAllStats] = useState<IBattingStatsExtended | null>(null);

  const isLoaded = allStats !== null;

  useEffect(() => {
    // Add all stats from match lineups
    const teamStats: IBattingStatsExtended = getCombinedTeamsStats(matchLineups).find((battingStat) => battingStat.id !== undefined) || defaultBattingStatsExtended;
    setAllStats(teamStats);

    // Reorder lineups by hit Order
    matchLineups.sort((a,b) => a.hitOrder - b.hitOrder);
  }, [matchLineups])

  const playersStats = getCombinedPlayersStats(matchLineups);
  const rows = ( playersStats && playersStats.map((playerStats) => {
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
  }) ) || [];
  
  return (
    <Stack spacing={3} alignItems="center" width="100%">
      <Scoreboard
        match={match}
        teamHome={teamHome}
        teamAway={teamAway}
        hasLinkMatchDetails={true}
      />
      { isLoaded && match.isCompleted === 1 && (
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
      )}

      { isLoaded && match.isCompleted === 1 && rows.length > 0 && (
        <CustomDataGrid
          pageSize={5}
          rows={rows}
          columns={playerExtendedStatsColumns}
          initialState={defaultStateStatsColumns}
          getRowId={(row:any) => row.id + "-match-" + match.id}
        />
      )}
    </Stack>
  )
}

export default TeamMatchResume;