import { Grid, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { ITeam, IStandingTeam } from '../Interfaces/team';
import { IMatch } from '../Interfaces/match';

import { createDateReadable } from '../utils/dateFormatter'

interface IScoreboardProps {
  teamHome: ITeam;
  teamAway: ITeam;
  match: IMatch;
  standingTeams: IStandingTeam[];
}

function Scoreboard(props: IScoreboardProps) {

  const {teamHome, teamAway, match, standingTeams} = props;

  const dateReadable = match !== null ? createDateReadable(match.date) : '';
  const tableTitle = match.isCompleted ? `Final score - ${teamHome.name} vs ${teamAway.name}` : `${teamHome.name} vs ${teamAway.name}`;
  const teamHomeStanding = standingTeams.find((standingTeam) => standingTeam.id === teamHome.id)
  const teamAwayStanding = standingTeams.find((standingTeam) => standingTeam.id === teamAway.id)

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" margin="auto">
      <Grid item >
        <Typography>{tableTitle}</Typography>
        <Typography>{dateReadable}</Typography>
      </Grid>
      <Grid item xs={3}>
        <TableContainer>
          <Table aria-label={tableTitle}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Team</TableCell>
                { match.isCompleted === 1 && <TableCell>Points</TableCell> }
                <TableCell>W</TableCell> 
                <TableCell>L</TableCell>
                <TableCell>N</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{teamHome.name}</TableCell>
                { match.isCompleted === 1 && <TableCell align="center">{match.teamHomePoints}</TableCell> }
                <TableCell align="center">{teamHomeStanding?.nbWins}</TableCell>
                <TableCell align="center">{teamHomeStanding?.nbLosts}</TableCell>
                <TableCell align="center">{teamHomeStanding?.nbNulls}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{teamAway.name}</TableCell>
                { match.isCompleted === 1 && <TableCell align="center">{match.teamAwayPoints}</TableCell> }
                <TableCell align="center">{teamAwayStanding?.nbWins}</TableCell>
                <TableCell align="center">{teamAwayStanding?.nbLosts}</TableCell>
                <TableCell align="center">{teamAwayStanding?.nbNulls}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default Scoreboard;