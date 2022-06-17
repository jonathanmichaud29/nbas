import { Box, Grid, Paper, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"



import { ITeam } from "../Interfaces/Team";
import { IMatch, IMatchLineup} from '../Interfaces/Match';
import { IPlayer, IPlayerMatchResumeProps } from '../Interfaces/Player';

import { createDateReadable } from '../utils/dateFormatter';

import PlayerStatBatResults from './PlayerStatBatResults';
import PlayerStatBattingPercentage from './PlayerStatBattingPercentage';

/**
 * Charts components
 */
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

/* ChartJS.register(ArcElement, Tooltip, Legend); // Doughnut */
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Vertical Bar

function PlayerMatchResume(props: IPlayerMatchResumeProps) {

  const {player, playerLineup, match, teamHome, teamAway} = props;

  const dateReadable = createDateReadable(match.date);
  const playingForTeam: ITeam = ( playerLineup.idTeam === teamHome.id ? teamHome : teamAway);

  return (
    <div>
      <h3>{dateReadable} : {teamHome.name} VS {teamAway.name}</h3>
      <p>Played with <b>{playingForTeam.name}</b></p>
      <h4>Game Stats</h4>
      <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6" component="h4" align="center">
              At Bats results
            </Typography>
            <PlayerStatBatResults
              single={playerLineup.single}
              double={playerLineup.double}
              triple={playerLineup.triple}
              homerun={playerLineup.homerun}
              out={playerLineup.out}
            />
          </Grid>
          <Grid item xs={8}>
            <PlayerStatBattingPercentage
              single={[playerLineup.single]}
              double={[playerLineup.double]}
              triple={[playerLineup.triple]}
              homerun={[playerLineup.homerun]}
              out={[playerLineup.out]}
              atBats={[playerLineup.atBats]}
              columns={[dateReadable]}
            />
          </Grid>
        </Grid>
      </Box>
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
            <TableRow>
              <TableCell>{player.name}</TableCell>
              <TableCell>{playerLineup.hitOrder}</TableCell>
              <TableCell>{playerLineup.atBats}</TableCell>
              <TableCell>{playerLineup.out}</TableCell>
              <TableCell>{playerLineup.single}</TableCell>
              <TableCell>{playerLineup.double}</TableCell>
              <TableCell>{playerLineup.triple}</TableCell>
              <TableCell>{playerLineup.homerun}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PlayerMatchResume;