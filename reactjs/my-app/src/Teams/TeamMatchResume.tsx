import { useState, useEffect} from 'react';

import { Box, Grid, Paper, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { createDateReadable } from '../utils/dateFormatter';

import { IPlayer } from '../Interfaces/Player';
import { ITeam, ITeamMatchResumeProps } from '../Interfaces/Team';
import { IPlayerLineupStats } from "../Interfaces/Match";

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getPlayerName } from '../utils/dataAssociation';

function TeamMatchResume(props: ITeamMatchResumeProps) {

  const {team, matchLineups, match, players, teamHome, teamAway} = props;

  const [allStats, setAllStats] = useState<IPlayerLineupStats | null>(null);

  const dateReadable = createDateReadable(match.date);

  const isLoaded = allStats !== null;

  useEffect(() => {
    // Add all stats from match lineups
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
    matchLineups.forEach((matchLineup) => {
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

  return (
    <div>
      <h3>{dateReadable} : {teamHome.name} VS {teamAway.name}</h3>
      <p><b>{ match.idTeamWon === team.id ? 'Victory' : 'Defeat'}</b> - {match.teamHomePoints} VS {match.teamAwayPoints}</p>
      <h4>Game Stats</h4>
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
                columns={["team stats"]}
              />
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell>Bat Order</TableCell>
                  <TableCell>At Bats</TableCell>
                  <TableCell>Out</TableCell>
                  <TableCell>Single</TableCell>
                  <TableCell>Double</TableCell>
                  <TableCell>Triple</TableCell>
                  <TableCell>Homerun</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { matchLineups.map((matchLineup) => {
                  return (
                    <TableRow>
                      <TableCell>{getPlayerName(matchLineup.idPlayer, players)}</TableCell>
                      <TableCell>{matchLineup.hitOrder}</TableCell>
                      <TableCell>{matchLineup.atBats}</TableCell>
                      <TableCell>{matchLineup.out}</TableCell>
                      <TableCell>{matchLineup.single}</TableCell>
                      <TableCell>{matchLineup.double}</TableCell>
                      <TableCell>{matchLineup.triple}</TableCell>
                      <TableCell>{matchLineup.homerun}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  )
}

export default TeamMatchResume;