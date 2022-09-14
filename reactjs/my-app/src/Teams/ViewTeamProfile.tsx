
import { useEffect, useState } from 'react';

import { Box, Paper, Stack, Typography } from "@mui/material";

import { ITeamProfileProps, ITeam } from '../Interfaces/team'
import { IMatch, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'

import { fetchHistoryMatches, IApiFetchHistoryMatchesParams } from '../ApiCall/matches';

import StandingTeam from './StandingTeam'
import TeamMatchResume from './TeamMatchResume'
import YearStats from '../Stats/YearStats'
import LoaderInfo from '../Generic/LoaderInfo';


function ViewTeamProfile(props: ITeamProfileProps) {

  const { team, league } = props;

  const [apiError, changeApiError] = useState("");
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);

  const isLoaded = listMatches !== null && listMatchLineups !== null && listTeams !== null && listPlayers !== null;

  useEffect(() => {
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
  }, [team.id])

  return (
    <>
      <Paper component={Box} m={3}>
        <Stack spacing={3} p={3} alignItems="center">
          <Typography variant="h1">
            {team.name} Profile
          </Typography>
          <Typography variant="h2">
            {league.name} League
          </Typography>
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
        </Stack>
      </Paper>
      
      { isLoaded && listMatches.length > 0 && (
        <Paper component={Box} m={3}>
          <Stack spacing={3} p={3} alignItems="center">
            <Typography variant="h3">
              Matches history
            </Typography>
            
            { listMatches.filter((match) => match.isCompleted === 1).map((match: IMatch) => {
              const teamHome = listTeams.find((team) => team.id === match.idTeamHome)
              const teamAway = listTeams.find((team) => team.id === match.idTeamAway)
              const matchLineups = listMatchLineups.filter((lineup) => lineup.idMatch === match.id)
              if( teamHome === undefined || teamAway === undefined || matchLineups === undefined ) return '';
              return (
                <TeamMatchResume
                  key={`team-match-resume-${match.id}`}
                  matchLineups={matchLineups}
                  match={match}
                  players={listPlayers}
                  teamHome={teamHome}
                  teamAway={teamAway}
                />
              )
            })}
          </Stack>
        </Paper>
      )}
    </>
  )
}

export default ViewTeamProfile;