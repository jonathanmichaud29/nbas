import { Link } from 'react-router-dom';

import { Grid, Paper } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IAllTeamsStandingProps }  from '../Interfaces/team'

import { getTeamName } from '../utils/dataAssociation'

function AllTeamsStanding(props: IAllTeamsStandingProps){
  
  const {teams, standingTeams} = props;

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{margin:"40px 0px"}}
    >
      <Grid item xs={4}>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 450 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell>GP</TableCell>
                <TableCell>W</TableCell>
                <TableCell>L</TableCell>
                <TableCell>N</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {standingTeams.map((standingTeam) => {
                const teamName = getTeamName(standingTeam.id, teams);
                return (
                  <TableRow key={`team-standing-${standingTeam.id}`}>
                    <TableCell><Link to={`/team/${standingTeam.id}`}>{teamName}</Link></TableCell>
                    <TableCell align="center">{standingTeam.nbGamePlayed}</TableCell>
                    <TableCell align="center">{standingTeam.nbWins}</TableCell>
                    <TableCell align="center">{standingTeam.nbLosts}</TableCell>
                    <TableCell align="center">{standingTeam.nbNulls}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default AllTeamsStanding;