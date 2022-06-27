

import { Grid, Paper } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IAllTeamsStandingProps }  from '../Interfaces/team'

import { getTeamName } from '../utils/dataAssociation'

function AllTeamsStanding(props: IAllTeamsStandingProps){
  
  const {teams, standings} = props;

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
                <TableCell>Game Played</TableCell>
                <TableCell>Win</TableCell>
                <TableCell>Lost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {standings.map((standing) => {
                const teamName = getTeamName(standing.idTeam, teams);
                return (
                  <TableRow key={`team-standing-${standing.idTeam}`}>
                    <TableCell>{teamName}</TableCell>
                    <TableCell align="center">{standing.gamePlayed}</TableCell>
                    <TableCell align="center">{standing.win}</TableCell>
                    <TableCell align="center">{standing.lost}</TableCell>
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