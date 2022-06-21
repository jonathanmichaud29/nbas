
import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress } from "@mui/material";

import { fetchPlayerHistoryMatches } from '../ApiCall/players';

import { IPlayerProfileProps } from '../Interfaces/player'
import { IMatch, IMatchLineup } from '../Interfaces/match'
import { ITeam } from '../Interfaces/team'

import PlayerMatchResume from './PlayerMatchResume'
import YearStats from '../Stats/YearStats';
import ProgressionStats from '../Stats/ProgressionStats';

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
        const allMatches: IMatch[] = response.data.matches.map((match: IMatch) => match);
        allMatches.sort((a,b) => a.date < b.date ? -1 : 1);
        setListMatches(allMatches);
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
      { isLoaded && (
        <YearStats
          key={`player-year-stat-${player.id}`}
          matchLineups={listMatchLineups}
          players={[player]}
        /> 
      )}
      { isLoaded && (
        <ProgressionStats
          key={`progression-player-stat-${player.id}`}
          matches={listMatches}
          matchLineups={listMatchLineups}
        />
      )}
      { isLoaded && listMatches && listMatches.map((match: IMatch) => {
        const teamHome = listTeams.find((team) => team.id === match.idTeamHome)
        const teamAway = listTeams.find((team) => team.id === match.idTeamAway)
        const playerLineup = listMatchLineups.find((lineup) => lineup.idMatch === match.id)
        if( teamHome === undefined || teamAway === undefined || playerLineup === undefined ) return '';
        return (
          <PlayerMatchResume
            key={`player-match-resume-${match.id}`}
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