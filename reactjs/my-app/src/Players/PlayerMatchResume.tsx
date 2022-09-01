import { Stack, Typography } from "@mui/material";

import { ITeam } from "../Interfaces/team";
import { IPlayerMatchResumeProps } from '../Interfaces/player';

import Scoreboard from "../Matchs/Scoreboard";
import YearStats from "../Stats/YearStats";

function PlayerMatchResume(props: IPlayerMatchResumeProps) {

  const {player, playerLineup, match, teamHome, teamAway} = props;

  const playingForTeam: ITeam = ( playerLineup.idTeam === teamHome.id ? teamHome : teamAway);
  
  return (
    <Stack alignItems="center" spacing={3} width="100%" pb={3}>
      <Scoreboard
        match={match}
        teamHome={teamHome}
        teamAway={teamAway}
        hasLinkMatchDetails={true}
      />
      <Typography align="center">Played for <b>{playingForTeam.name}</b></Typography>
      <YearStats
        matchLineups={[playerLineup]}
        players={[player]}
        title={`match stats`}
      />
    </Stack>
  )
}

export default PlayerMatchResume;