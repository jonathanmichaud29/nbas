import { Box, Card, CardContent, CardHeader, Stack } from "@mui/material";

import { ITeam } from "../Interfaces/team";
import { IPlayerMatchResumeProps } from '../Interfaces/player';

import Scoreboard from "../Matchs/Scoreboard";
import YearStats from "../Stats/YearStats";

function PlayerMatchResume(props: IPlayerMatchResumeProps) {

  const {player, playerLineup, match, teamHome, teamAway} = props;

  const playingForTeam: ITeam = ( playerLineup.idTeam === teamHome.id ? teamHome : teamAway);
  
  return (
    <Card raised={true} component={Box} width="100%">
      <CardHeader 
        title={`Played with ${playingForTeam.name}`}
        titleTypographyProps={{variant:'h3'}}
      />
      <CardContent component={Stack} spacing={3}>
        <Scoreboard
          match={match}
          teamHome={teamHome}
          teamAway={teamAway}
          hasLinkMatchDetails={true}
        />
        
        <YearStats
          matchLineups={[playerLineup]}
          players={[player]}
          title={`match stats`}
        />
      </CardContent>
    </Card>
  )
}

export default PlayerMatchResume;