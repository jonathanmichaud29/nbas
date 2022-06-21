import { useState, useEffect } from 'react';

import { Box, Grid, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import { IPlayerStatsExtended, ITeamStats, IYearStatsProps } from '../Interfaces/stats';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getPlayerName } from '../utils/dataAssociation';
import { playerExtendedStatsColumns } from '../utils/dataGridColumns'
import { getStatHits,getStatSlugging } from '../utils/statsAggregation'

function YearStats(props: IYearStatsProps) {

  const {matchLineups, players} = props;

  const [allTeamStats, setAllTeamStats] = useState<ITeamStats | null>(null);
  const [allPlayerStats, setAllPlayerStats] = useState<IPlayerStatsExtended[] | null>(null);

  const isLoaded = allTeamStats !== null && allPlayerStats !== null;

  useEffect(() => {
    let playersStats = [] as IPlayerStatsExtended[];
    let teamStats: ITeamStats = {
      atBats: 0,
      single: 0,
      double: 0,
      triple: 0,
      homerun: 0,
      out: 0,
    };
    
    matchLineups.forEach((matchLineup) => {
      teamStats.atBats += matchLineup.atBats;
      teamStats.single += matchLineup.single;
      teamStats.double += matchLineup.double;
      teamStats.triple += matchLineup.triple;
      teamStats.homerun += matchLineup.homerun;
      teamStats.out += matchLineup.out;

      let playerFound = playersStats.find((playerStats) => playerStats.id === matchLineup.idPlayer )
      if( playerFound === undefined ){
        playersStats.push({
          id: matchLineup.idPlayer,
          atBats: matchLineup.atBats,
          single: matchLineup.single,
          double: matchLineup.double,
          triple: matchLineup.triple,
          homerun: matchLineup.homerun,
          out: matchLineup.out,
          sluggingPercentage: 0,
          battingAverage: 0,
        })
      }
      else {
        playerFound.atBats += matchLineup.atBats;
        playerFound.single += matchLineup.single;
        playerFound.double += matchLineup.double;
        playerFound.triple += matchLineup.triple;
        playerFound.homerun += matchLineup.homerun;
        playerFound.out += matchLineup.out;
      }
    });
    playersStats.every((playerStats) => {
      const nbHits = getStatHits(playerStats.single, playerStats.double, playerStats.triple, playerStats.homerun);
      const sluggingTotal = getStatSlugging(playerStats.single, playerStats.double, playerStats.triple, playerStats.homerun);
      playerStats.battingAverage = ( nbHits / playerStats.atBats);
      playerStats.sluggingPercentage = ( sluggingTotal / playerStats.atBats);
      if( isNaN(playerStats.battingAverage) ) {
        playerStats.battingAverage = 0;
      }
      if( isNaN(playerStats.sluggingPercentage) ) {
        playerStats.sluggingPercentage = 0;
      }
      return true;
    })
    
    setAllTeamStats(teamStats);
    setAllPlayerStats(playersStats);
  }, [matchLineups]);


  const rows = ( allPlayerStats && allPlayerStats.map((playerStats) => {
    return {
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
        <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6" component="h4" align="center">
                At Bats results
              </Typography>
              <StatBatResults
                single={allTeamStats.single}
                double={allTeamStats.double}
                triple={allTeamStats.triple}
                homerun={allTeamStats.homerun}
                out={allTeamStats.out}
              />
            </Grid>
            <Grid item xs={8}>
              <StatBattingPercentage
                single={[allTeamStats.single]}
                double={[allTeamStats.double]}
                triple={[allTeamStats.triple]}
                homerun={[allTeamStats.homerun]}
                atBats={[allTeamStats.atBats]}
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