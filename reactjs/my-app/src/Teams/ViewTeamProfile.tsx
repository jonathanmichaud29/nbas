
import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress } from "@mui/material";

import { fetchTeamHistoryMatches } from '../ApiCall/teams';

import { ITeamProfileProps, ITeam } from '../Interfaces/team'
import { IMatch, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'

import TeamStanding from './TeamStanding'
import TeamMatchResume from './TeamMatchResume'
import YearStats from '../Stats/YearStats'

function ViewTeamProfile(props: ITeamProfileProps) {

  const { team } = props;

  const [apiError, changeApiError] = useState("");
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);

  const isLoaded = listMatches !== null && listMatchLineups !== null && listTeams !== null && listPlayers !== null;

  useEffect(() => {
    fetchTeamHistoryMatches(team.id)
      .then((response) => {
        setListPlayers(response.data.players);
        setListTeams(response.data.teams);
        setListMatches(response.data.matches);
        setListMatchLineups(response.data.matchLineups);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
  }, [team.id])

  return (
    <>
      <h2>{team.name} Profile</h2>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && (
        <TeamStanding
          key={`team-standing-${team.id}`}
          team={team}
          matches={listMatches}
        />
      )}
      { isLoaded && (
        <YearStats
          key={`team-year-stat-${team.id}`}
          matchLineups={listMatchLineups}
          players={listPlayers}
        /> 
      )}
      { isLoaded && listMatches && listMatches.map((match: IMatch) => {
        const teamHome = listTeams.find((team) => team.id === match.idTeamHome)
        const teamAway = listTeams.find((team) => team.id === match.idTeamAway)
        const matchLineups = listMatchLineups.filter((lineup) => lineup.idMatch === match.id)
        if( teamHome === undefined || teamAway === undefined || matchLineups === undefined ) return '';
        return (
          <TeamMatchResume
            key={`team-match-resume-${match.id}`}
            team={team}
            matchLineups={matchLineups}
            match={match}
            players={listPlayers}
            teamHome={teamHome}
            teamAway={teamAway}
          />  
        )
      })}
    </>
  )
}

export default ViewTeamProfile;