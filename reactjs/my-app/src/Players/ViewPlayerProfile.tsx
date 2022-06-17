
import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress } from "@mui/material";

import { fetchPlayerHistoryMatches } from '../ApiCall/players';

import { IPlayerProfileProps } from '../Interfaces/Player'
import { IMatch, IMatchLineup } from '../Interfaces/Match'
import { ITeam } from '../Interfaces/Team'

import PlayerMatchResume from './PlayerMatchResume'

function ViewPlayerProfile(props: IPlayerProfileProps) {

  const { player } = props;

  const [apiError, changeApiError] = useState("");
  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);

  const isLoaded = listMatches !== null && listMatchLineups !== null && listTeams !== null;

  useEffect(() => {
    fetchPlayerHistoryMatches(player.id)
      .then((response) => {
        setListTeams(response.data.teams);
        setListMatches(response.data.matches);
        setListMatchLineups(response.data.matchLineups);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
  }, [player.id])

  return (
    <>
      <h2>{player.name} Profile</h2>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && listMatches && listMatches.map((match: IMatch) => {
        const teamHome = listTeams.find((team) => team.id === match.idTeamHome)
        const teamAway = listTeams.find((team) => team.id === match.idTeamAway)
        const playerLineup = listMatchLineups.find((lineup) => lineup.idMatch === match.id)
        if( teamHome === undefined || teamAway === undefined || playerLineup === undefined ) return '';
        return (
          <PlayerMatchResume
            key={`player-match-resume-${match.id}`}
            player={player}
            playerLineup={playerLineup}
            match={match}
            teamHome={teamHome}
            teamAway={teamAway}
          />  
        )
      })}
    </>
  )
}

export default ViewPlayerProfile;