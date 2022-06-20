
import { useEffect, useState } from 'react';

import { Alert, Paper, Button, Box, Grid, Modal, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { ITeamStandingProps }  from '../Interfaces/Team'

function TeamStanding(props: ITeamStandingProps){
  
  const {team, matches} = props;

  const [nbVictories, setVictories] = useState<number>(0);
  const [nbDefeats, setDefeats] = useState<number>(0);

  useEffect(() => {
    let victories = 0;
    let defeats = 0;
    matches.forEach((match) => {
      if( match.isCompleted === 0 ){
        return;
      }
      if( match.idTeamWon === team.id ){
        victories++;
      }
      if( match.idTeamLost === team.id ){
        defeats++;
      }
    });
    setVictories(victories);
    setDefeats(defeats);
  }, [matches, team.id])

  return (
    <>
      <h2>{team.name} Standing</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='right'>Win</TableCell>
              <TableCell align='left'>Lost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align='right'>{nbVictories}</TableCell>
              <TableCell align='left'>{nbDefeats}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default TeamStanding;