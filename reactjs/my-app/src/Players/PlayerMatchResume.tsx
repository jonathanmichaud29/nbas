import { Box, Grid, Typography } from "@mui/material";

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
  console.log("playerLineup", playerLineup);
  return (
    <>
      <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Scoreboard
              match={match}
              teamHome={teamHome}
              teamAway={teamAway}
            />
            <Typography>Played with <b>{playingForTeam.name}</b></Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" component="h4" align="center">
              At Bats results
            </Typography>
            <StatBatResults
              single={playerLineup.single}
              double={playerLineup.double}
              triple={playerLineup.triple}
              homerun={playerLineup.homerun}
              out={playerLineup.out}
            />
          </Grid>
          <Grid item xs={8}>
            <StatBattingPercentage
              stats={[playerStats]}
              columns={[dateReadable]}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default PlayerMatchResume;