import { useState, useEffect } from 'react';

import { Box, Grid, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { IBattingStatsExtended, IYearStatsProps, defaultBattingStatsExtended } from '../Interfaces/stats';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getPlayerName } from '../utils/dataAssociation';
import { playerExtendedStatsColumns, defaultStateStatsColumns, defaultDataGridProps } from '../utils/dataGridColumns'
import { getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation'

function YearStats(props: IYearStatsProps) {

  const {matchLineups, players, title} = props;

  const [allStats, setAllStats] = useState<IBattingStatsExtended | null>(null);
  const [allPlayerStats, setAllPlayerStats] = useState<IBattingStatsExtended[] | null>(null);

  const isLoaded = allStats !== null && allPlayerStats !== null;

  useEffect(() => {
    const playersStats: IBattingStatsExtended[] = getCombinedPlayersStats(matchLineups);
    setAllPlayerStats(playersStats);

    const teamStats: IBattingStatsExtended = getCombinedTeamsStats(matchLineups).find((battingStat) => battingStat.id !== undefined) || defaultBattingStatsExtended;
    setAllStats(teamStats);
  }, [matchLineups]);

  const rows = ( allPlayerStats && allPlayerStats.map((playerStats) => {
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
    <>
      { isLoaded && (
        <Box>
          <Grid container spacing={2} style={{ margin:"20px 0px", width:"100%"}}>
            <Grid item xs={12}>
              <Typography component="h2" variant="h6" align='center'>{title}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatBatResults
                single={allStats.single}
                double={allStats.double}
                triple={allStats.triple}
                homerun={allStats.homerun}
                out={allStats.out}
              />
            </Grid>
            <Grid item xs={12} sm={6} p={3}>
              <StatBattingPercentage
                stats={[allStats]}
                columns={["Season Statistics"]}
              />
            </Grid>
          
            { rows.length > 0 && (
              <Grid item xs={12}>
                <DataGrid
                  {...defaultDataGridProps}
                  rows={rows}
                  columns={playerExtendedStatsColumns}
                  getRowId={(row) => row.playerName}
                  initialState={defaultStateStatsColumns}
                  components={{
                    Toolbar: GridToolbar
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </>
  )
}

export default YearStats;