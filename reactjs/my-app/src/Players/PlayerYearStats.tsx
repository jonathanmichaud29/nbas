import { useState, useEffect } from 'react';

import { Box, Grid, Typography } from "@mui/material";
import { IPlayerLineupStats } from "../Interfaces/Match";

import { IPlayerYearStatsProps } from '../Interfaces/Player';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

function PlayerYearStats(props: IPlayerYearStatsProps) {

  const {player, playerLineups} = props;

  const [allStats, setAllStats] = useState<IPlayerLineupStats | null>(null);

  const isLoaded = allStats !== null;

  useEffect(() => {
    let newStats: IPlayerLineupStats = {
      lineupId: 0,
      atBats: 0,
      single: 0,
      double: 0,
      triple: 0,
      homerun: 0,
      out: 0,
      hitOrder: 0,
    };
    playerLineups.forEach((playerLineup) => {
      newStats.atBats += playerLineup.atBats;
      newStats.single += playerLineup.single;
      newStats.double += playerLineup.double;
      newStats.triple += playerLineup.triple;
      newStats.homerun += playerLineup.homerun;
      newStats.out += playerLineup.out;
    });
    setAllStats(newStats);
  }, [playerLineups])

  return (
    <div>
      <h3>Year stats</h3>
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
                single={[allStats.single]}
                double={[allStats.double]}
                triple={[allStats.triple]}
                homerun={[allStats.homerun]}
                out={[allStats.out]}
                atBats={[allStats.atBats]}
                columns={["year long stats"]}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  )
}

export default PlayerYearStats;