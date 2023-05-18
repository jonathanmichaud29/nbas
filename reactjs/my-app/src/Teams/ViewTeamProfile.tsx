import { useMemo, useState } from 'react';
import { batch } from 'react-redux';

import { Box, Paper, Stack, Typography } from "@mui/material";

import { usePublicContext } from '../Public/PublicApp';

import { ITeam } from '../Interfaces/team'
import { IMatch, IMatchLineup } from '../Interfaces/match'

import { fetchHistoryMatches, IApiFetchHistoryMatchesParams } from '../ApiCall/matches';

import StandingTeam from './StandingTeam'
import TeamMatchResume from './TeamMatchResume'
import YearStats from '../Stats/YearStats'
import LoaderInfo from '../Generic/LoaderInfo';

interface ITeamProfileProps{
  team: ITeam;
}

function ViewTeamProfile(props: ITeamProfileProps) {

  const { team } = props;

  const { league, leagueSeason, leaguePlayers, leagueSeasonTeams } = usePublicContext();

  const [apiError, changeApiError] = useState<string>("");
  const [listMatches, setListMatches] = useState<IMatch[]>([]);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const listCompletedMatches = listMatches?.filter((match) => match.isCompleted === 1) || []

  useMemo(() => {
    const paramsHistoryMatches: IApiFetchHistoryMatchesParams = {
      teamId: team.id,
      leagueSeasonId: leagueSeason.id
    }
    fetchHistoryMatches(paramsHistoryMatches)
      .then((response) => {
        batch(() => {
          setListMatches(response.data.matches || []);
          setListMatchLineups(response.data.matchLineups || []);
          setDataLoaded(true);
        })
      })
      .catch((error) => {
        batch(() => {
          changeApiError(error);
          setDataLoaded(true);
        })
        
      })
      .finally(() => {

      })
  }, [leagueSeason.id, team.id])

  

  return (
    <>
      <Paper component={Box} m={3} p={3}>
        <Stack spacing={3} alignItems="center" pb={3} width="100%">
          <Box>
            <Typography variant="h1" textAlign='center'>{team.name}</Typography>
            <Typography variant="h1" textAlign='center'>{league.name} - {leagueSeason.name}</Typography>
          </Box>
          <LoaderInfo
            isLoading={dataLoaded}
            msgError={apiError}
          />
          { dataLoaded ? (
            <>
              <StandingTeam
                key={`team-standing-${team.id}`}
                team={team}
                matches={listMatches}
              />
              <YearStats
                key={`team-year-stat-${team.id}`}
                matchLineups={listMatchLineups}
                players={leaguePlayers}
                title={`Season batting stats`}
              /> 
            </>
          ) : '' }
        </Stack>
      </Paper>
      
      { dataLoaded && listCompletedMatches.length > 0 
      ? 
        <Paper component={Box} p={3} m={3}>
          <Stack spacing={3} alignItems="center" pb={3} width="100%">
            <Typography variant="h2">Team matches history</Typography>
          
            { listCompletedMatches.map((match) => {
              const teamHome = leagueSeasonTeams.find((team) => team.id === match.idTeamHome) || null
              const teamAway = leagueSeasonTeams.find((team) => team.id === match.idTeamAway) || null
              const matchLineups = listMatchLineups.filter((lineup) => lineup.idMatch === match.id)
              if( teamHome === null || teamAway === null ) return '';
              return (
                <TeamMatchResume
                  key={`team-match-resume-${match.id}`}
                  matchLineups={matchLineups}
                  match={match}
                  players={leaguePlayers}
                  teamHome={teamHome}
                  teamAway={teamAway}
                />
              )
            })} 
          </Stack>
        </Paper>
      : '' }
    </>
  )
}

export default ViewTeamProfile;