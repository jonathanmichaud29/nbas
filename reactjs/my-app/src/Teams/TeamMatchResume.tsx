import { useState, useEffect} from 'react';

import { Box, Grid, Typography } from "@mui/material";
import { DataGrid} from '@mui/x-data-grid';

import { createDateReadable } from '../utils/dateFormatter';

import { ITeamMatchResumeProps } from '../Interfaces/team';
import { IPlayerStats } from "../Interfaces/stats";

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getPlayerName } from '../utils/dataAssociation';
import { playerStatsColumns } from '../utils/dataGridColumns'

function TeamMatchResume(props: ITeamMatchResumeProps) {

  const {team, matchLineups, match, players, teamHome, teamAway, hideHeader} = props;

  const [allStats, setAllStats] = useState<IPlayerStats | null>(null);

  const dateReadable = createDateReadable(match.date);

  const isLoaded = allStats !== null;

  useEffect(() => {
    // Add all stats from match lineups
    let newStats: IPlayerStats = {
      id: 0,
      atBats: 0,
      single: 0,
      double: 0,
      triple: 0,
      homerun: 0,
      out: 0,
    };
    matchLineups.forEach((matchLineup) => {
      newStats.id = matchLineup.idPlayer;
      newStats.atBats += matchLineup.atBats;
      newStats.single += matchLineup.single;
      newStats.double += matchLineup.double;
      newStats.triple += matchLineup.triple;
      newStats.homerun += matchLineup.homerun;
      newStats.out += matchLineup.out;
    });
    setAllStats(newStats);

    // Reorder lineups by hit Order
    matchLineups.sort((a,b) => a.hitOrder - b.hitOrder);
  }, [matchLineups])


  const rows = ( matchLineups && matchLineups.map((playerStats) => {
    return {
      id: playerStats.idPlayer,
      playerName: getPlayerName(playerStats.idPlayer, players),
      atBats: playerStats.atBats,
      out: playerStats.out,
      single: playerStats.single,
      double: playerStats.double,
      triple: playerStats.triple,
      homerun: playerStats.homerun,
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
                single={[allStats.single]}
                double={[allStats.double]}
                triple={[allStats.triple]}
                homerun={[allStats.homerun]}
                atBats={[allStats.atBats]}
                columns={["team stats"]}
              />
            </Grid>
          </Grid>

          <DataGrid
            rows={rows}
            columns={playerStatsColumns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row.id + "-match-" + match.id}
            autoHeight={true}
          />
        </Box>
      )}
    </div>
  )
}

export default TeamMatchResume;