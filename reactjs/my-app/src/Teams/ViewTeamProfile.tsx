import { useMemo, useState } from 'react';

import { Alert, Box, Divider, Paper, Stack, Typography } from "@mui/material";

import { ITeam } from '../Interfaces/team'
import { IMatch, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'
import { ILeagueSeason } from '../Interfaces/league';

import { fetchHistoryMatches, IApiFetchHistoryMatchesParams } from '../ApiCall/matches';

import StandingTeam from './StandingTeam'
import TeamMatchResume from './TeamMatchResume'
import YearStats from '../Stats/YearStats'
import LoaderInfo from '../Generic/LoaderInfo';


interface ITeamProfileProps{
  team: ITeam;
  leagueSeason: ILeagueSeason;
}

function ViewTeamProfile(props: ITeamProfileProps) {

  const { team, leagueSeason } = props;

  const [apiError, changeApiError] = useState("");
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);

  const isLoaded = listMatches !== null && listMatchLineups !== null && listTeams !== null && listPlayers !== null;

  useMemo(() => {
    const paramsHistoryMatches: IApiFetchHistoryMatchesParams = {
      teamId: team.id
    }
    fetchHistoryMatches(paramsHistoryMatches)
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
  }, [team])

  const listCompletedMatches = listMatches?.filter((match) => match.isCompleted === 1) || []

  return (
    <Paper component={Box} m={3} p={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h1">{team.name} - {leagueSeason.name}</Typography>
        <LoaderInfo
          isLoading={isLoaded}
          msgError={apiError}
        />
        { isLoaded && (
          <StandingTeam
            key={`team-standing-${team.id}`}
            team={team}
            matches={listMatches}
          />
        )}
        {isLoaded && (
          <YearStats
            key={`team-year-stat-${team.id}`}
            matchLineups={listMatchLineups}
            players={listPlayers}
            title={`Season batting stats`}
          /> 
        )}

        <Divider />
        <Typography variant="h2">Matches history</Typography>
        
        { listCompletedMatches.length > 0 ? listCompletedMatches.map((match) => {
          const teamHome = listTeams?.find((team) => team.id === match.idTeamHome)
          const teamAway = listTeams?.find((team) => team.id === match.idTeamAway)
          const matchLineups = listMatchLineups?.filter((lineup) => lineup.idMatch === match.id)
          if( teamHome === undefined || teamAway === undefined || matchLineups === undefined ) return '';
          return (
            <TeamMatchResume
              key={`team-match-resume-${match.id}`}
              matchLineups={matchLineups}
              match={match}
              players={listPlayers || []}
              teamHome={teamHome}
              teamAway={teamAway}
            />
          )
        }) : (
          <Alert severity='info'>No Match found</Alert>
        )}
      </Stack>
    </Paper>
  )
}

export default ViewTeamProfile;