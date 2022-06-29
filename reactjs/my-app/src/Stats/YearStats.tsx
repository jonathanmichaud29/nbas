import { useState, useEffect } from 'react';

import { Box, Grid } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import { IBattingStatsExtended, ITeamStats, IYearStatsProps, defaultBattingStatsExtended } from '../Interfaces/stats';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getPlayerName } from '../utils/dataAssociation';
import { playerExtendedStatsColumns } from '../utils/dataGridColumns'
import { getCombinedPlayersStats, getCombinedTeamsStats } from '../utils/statsAggregation'

function YearStats(props: IYearStatsProps) {

  const {matchLineups, players} = props;

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
      battingAverage: playerStats.battingAverage,
      sluggingPercentage: playerStats.sluggingPercentage,
    }
  }) ) || [];

  return (
    <div>
      <h3>Year stats</h3>
      { isLoaded && (
        <Box sx={{ flexGrow: 1, justifyContent: "center"}}>
          <Grid container spacing={2} style={{ margin:"20px 0px", width:"100%"}}>
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
                columns={["year long stats"]}
              />
            </Grid>
          </Grid>

          <DataGrid
            rows={rows}
            columns={playerExtendedStatsColumns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row.playerName}
            autoHeight={true}
          />
        </Box>
      )}
    </div>
  )
}

export default YearStats;