import { useState, useEffect } from 'react';

import { Box, Grid, Paper, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IPlayer } from "../Interfaces/Player";
import { IPlayerStats, IPlayerLineupStats } from "../Interfaces/Match";
import { IYearStatsProps } from '../Interfaces/Generic';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';



function YearStats(props: IYearStatsProps) {

  const {matchLineups, players} = props;

  const [allTeamStats, setAllTeamStats] = useState<IPlayerLineupStats | null>(null);
  const [allPlayerStats, setAllPlayerStats] = useState<IPlayerStats[] | null>(null);

  const isLoaded = allTeamStats !== null;

  const getPlayerName = (idPlayer: number): string => {
    const defaultReturn = "Player not found in lineup";
    if( players ){
      const playerFound = players.find((player: IPlayer) => player.id === idPlayer);
      if( playerFound ) return playerFound.name;
    }
    return defaultReturn;
  }

  useEffect(() => {
    let playersStats = [] as IPlayerStats[];
    let teamStats: IPlayerLineupStats = {
      lineupId: 0,
      atBats: 0,
      single: 0,
      double: 0,
      triple: 0,
      homerun: 0,
      out: 0,
      hitOrder: 0,
    };
    const templatePlayerStats: IPlayerStats = {
      id: 0,
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
    setAllTeamStats(teamStats);
    setAllPlayerStats(playersStats);
  }, [matchLineups])

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
                out={[allTeamStats.out]}
                atBats={[allTeamStats.atBats]}
                columns={["year long stats"]}
              />
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell>At Bats</TableCell>
                  <TableCell>Out</TableCell>
                  <TableCell>Single</TableCell>
                  <TableCell>Double</TableCell>
                  <TableCell>Triple</TableCell>
                  <TableCell>Homerun</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { allPlayerStats && allPlayerStats.map((playerStats) => {
                  return (
                    <TableRow>
                      <TableCell>{getPlayerName(playerStats.id)}</TableCell>
                      <TableCell>{playerStats.atBats}</TableCell>
                      <TableCell>{playerStats.out}</TableCell>
                      <TableCell>{playerStats.single}</TableCell>
                      <TableCell>{playerStats.double}</TableCell>
                      <TableCell>{playerStats.triple}</TableCell>
                      <TableCell>{playerStats.homerun}</TableCell>
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

export default YearStats;