
import { useEffect, useState } from 'react';

import { Box, Grid, Paper } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IStandingTeamProps }  from '../Interfaces/team'

function StandingTeam(props: IStandingTeamProps){
  
  const {team, matches} = props;

  const [standing, setStanding] = useState({
    gamePlayed:0,
    win:0,
    lost:0,
    tie:0,
  });

  useEffect(() => {
    let gamePlayed = 0;
    let win = 0;
    let lost = 0;
    let tie = 0;
    matches.forEach((match) => {
      if( match.isCompleted === 0 ){
        return;
      }
      gamePlayed++;
      if( match.idTeamWon === team.id ){
        win++;
      }
      else if( match.idTeamLost === team.id ){
        lost++;
      }
      else {
        tie++
      }
      
    });
    setStanding({
      gamePlayed,
      win,
      lost,
      tie,
    });
  }, [matches, team.id])

  return (
    
    <Grid container flexDirection="column" alignItems="center" justifyContent="center">
      <Grid item>
        <TableContainer component={Paper}>
          <Table aria-label={`${team.name} Season Stats`}>
            <TableHead>
              <TableRow>
                <TableCell align='center'>GP</TableCell>
                <TableCell align='center'>W</TableCell>
                <TableCell align='center'>L</TableCell>
                <TableCell align='center'>N</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>{standing.gamePlayed}</TableCell>
                <TableCell align='center'>{standing.win}</TableCell>
                <TableCell align='center'>{standing.lost}</TableCell>
                <TableCell align='center'>{standing.tie}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default StandingTeam;