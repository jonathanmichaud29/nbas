import { useState, useEffect} from 'react';

import { Box, Grid, Typography } from "@mui/material";
import { DataGrid, GridToolbar} from '@mui/x-data-grid';

import { createDateReadable } from '../utils/dateFormatter';

import { ITeamMatchResumeProps } from '../Interfaces/team';
import { IBattingStatsExtended, defaultBattingStatsExtended } from "../Interfaces/stats";

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation';
import { playerExtendedStatsColumns, defaultStateStatsColumns, defaultDataGridProps } from '../utils/dataGridColumns'

function TeamMatchResume(props: ITeamMatchResumeProps) {

  const {team, matchLineups, match, players, teamHome, teamAway, hideHeader} = props;

  const [allStats, setAllStats] = useState<IBattingStatsExtended | null>(null);

  const dateReadable = createDateReadable(match.date);

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
    <div>
      { ! hideHeader && (
        <>
          <h3>{dateReadable} : {teamHome.name} VS {teamAway.name}</h3>
          <p><b>{ match.idTeamWon === team.id ? 'Victory' : 'Defeat'}</b> - {match.teamHomePoints} VS {match.teamAwayPoints}</p>
        </>
      )}
      <h4>{team.name} Stats</h4>
      { isLoaded && (
        <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6" component="h4" align="center">
                At Bats results
              </Typography>
              <StatBatResults
                single={allStats.single}
                double={allStats.double}
                triple={allStats.triple}
                homerun={allStats.homerun}
                out={allStats.out}
              />
            </Grid>
            <Grid item xs={8}>
              <StatBattingPercentage
                stats={[allStats]}
                columns={["team stats"]}
              />
            </Grid>
          </Grid>

          { rows.length > 0 && (
            <DataGrid
              {...defaultDataGridProps}
              rows={rows}
              columns={playerExtendedStatsColumns}
              getRowId={(row) => row.id + "-match-" + match.id}
              initialState={defaultStateStatsColumns}
              components={{
                Toolbar: GridToolbar
              }}
            />
          )}
        </Box>
      )}
    </div>
  )
}

export default TeamMatchResume;