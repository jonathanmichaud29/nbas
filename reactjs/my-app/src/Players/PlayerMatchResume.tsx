import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { ITeam } from "../Interfaces/team";
import { IPlayerMatchResumeProps } from '../Interfaces/player';

import StatBatResults from "../Stats/StatBatResults";
import StatBattingPercentage from "../Stats/StatBattingPercentage";

import { createDateReadable } from '../utils/dateFormatter';
import { getCombinedPlayersStats } from '../utils/statsAggregation'
import Scoreboard from "../Matchs/Scoreboard";

function PlayerMatchResume(props: IPlayerMatchResumeProps) {

  const {playerLineup, match, teamHome, teamAway} = props;

  const dateReadable = createDateReadable(match.date);
  const playingForTeam: ITeam = ( playerLineup.idTeam === teamHome.id ? teamHome : teamAway);
  const playerStats = getCombinedPlayersStats([playerLineup])[0];
  
  return (
    <Box p={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} p={3}>
          <Scoreboard
            match={match}
            teamHome={teamHome}
            teamAway={teamAway}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">Played with <b>{playingForTeam.name}</b></Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatBatResults
            single={playerLineup.single}
            double={playerLineup.double}
            triple={playerLineup.triple}
            homerun={playerLineup.homerun}
            out={playerLineup.out}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatBattingPercentage
            stats={[playerStats]}
            columns={[dateReadable]}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PlayerMatchResume;