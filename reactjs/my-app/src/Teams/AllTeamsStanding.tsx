import { Box, Card, CardContent, Grid, Link, Paper, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IAllTeamsStandingProps }  from '../Interfaces/team'

import { getTeamName } from '../utils/dataAssociation'

function AllTeamsStanding(props: IAllTeamsStandingProps){
  
  const {teams, standingTeams} = props;

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item xs={12} style={{width:'100%'}}>
              <Typography component="h1" variant="h3" align="center">
                League Teams Standing
              </Typography>
            </Grid>
            <Grid item  xs={12} style={{width:'100%'}}>
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
                              <TableCell><Link href={`/team/${standingTeam.id}`}>{teamName}</Link></TableCell>
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
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AllTeamsStanding;