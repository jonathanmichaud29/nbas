import { Link } from 'react-router-dom';

import { Grid, Paper, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { ITeam, IStandingTeam } from '../Interfaces/team';
import { IMatch } from '../Interfaces/match';

import { createDateReadable } from '../utils/dateFormatter'

interface IScoreboardProps {
  teamHome: ITeam;
  teamAway: ITeam;
  match: IMatch;
  standingTeams?: IStandingTeam[];
}

function Scoreboard(props: IScoreboardProps) {

  const {teamHome, teamAway, match, standingTeams} = props;

  const dateReadable = match !== null ? createDateReadable(match.date) : '';
  const tableTitle = `${teamHome.name} vs ${teamAway.name}`;
  const teamHomeStanding = standingTeams && standingTeams.find((standingTeam) => standingTeam.id === teamHome.id)
  const teamAwayStanding = standingTeams && standingTeams.find((standingTeam) => standingTeam.id === teamAway.id)

  const isTeamStandings = standingTeams && teamHomeStanding && teamAwayStanding;

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid item >
        <Typography variant="h6" component="h3"><Link to={`/match/${match.id}`}>{tableTitle}</Link></Typography>
        <Typography variant="subtitle1">{dateReadable}</Typography>
      </Grid>
      <Grid item xs={3}>
        <TableContainer component={Paper}>
          <Table aria-label={tableTitle}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Team</TableCell>
                { match.isCompleted === 1 && <TableCell>Points</TableCell> }
                { isTeamStandings && (
                  <>
                    <TableCell>W</TableCell> 
                    <TableCell>L</TableCell>
                    <TableCell>N</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell><Link to={`/team/${teamHome.id}`}>{teamHome.name}</Link></TableCell>
                { match.isCompleted === 1 && <TableCell align="center">{match.teamHomePoints}</TableCell> }
                { isTeamStandings && (
                  <>
                    <TableCell align="center">{teamHomeStanding.nbWins}</TableCell>
                    <TableCell align="center">{teamHomeStanding.nbLosts}</TableCell>
                    <TableCell align="center">{teamHomeStanding.nbNulls}</TableCell>
                  </>
                )}
              </TableRow>
              <TableRow>
              <TableCell><Link to={`/team/${teamAway.id}`}>{teamAway.name}</Link></TableCell>
                { match.isCompleted === 1 && <TableCell align="center">{match.teamAwayPoints}</TableCell> }
                { isTeamStandings && (
                  <>
                    <TableCell align="center">{teamAwayStanding.nbWins}</TableCell>
                    <TableCell align="center">{teamAwayStanding.nbLosts}</TableCell>
                    <TableCell align="center">{teamAwayStanding.nbNulls}</TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default Scoreboard;