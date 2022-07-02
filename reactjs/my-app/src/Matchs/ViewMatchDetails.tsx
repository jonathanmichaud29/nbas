
import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress } from "@mui/material";

import { fetchMatchLineups } from '../ApiCall/matches';
import { fetchTeams, fetchStandingTeams, IApiFetchTeamsParams, IApiFetchStandingTeamsParams } from '../ApiCall/teams';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import { ITeam, IStandingTeam } from '../Interfaces/team'
import { IMatchDetailsProps, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'

import TeamMatchResume from '../Teams/TeamMatchResume'
import Scoreboard from './Scoreboard';
import { createDateReadable } from '../utils/dateFormatter';

import { setMetas } from '../utils/metaTags';

function ViewMatchDetails(props: IMatchDetailsProps) {

  const { match } = props;

  const [apiError, changeApiError] = useState("");
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[] | null>(null);

  const isLoaded = listMatchLineups !== null && teamHome !== null && teamAway !== null && listPlayers !== null && standingTeams !== null;

  if( teamHome !== null && teamAway !== null ){
    setMetas({
      title:`Match summary - ${teamHome.name} vs ${teamAway.name}`,
      description:`NBAS match summary ${teamHome.name} vs ${teamAway.name} on date ${createDateReadable(match.date)}`
    });
  }

  useEffect(() => {
    if( listMatchLineups !== null && teamHome !== null && teamAway !== null ) return;
    fetchMatchLineups(match.id)
      .then((response) => {
        setListMatchLineups(response.data);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
    
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [match.idTeamHome, match.idTeamAway]
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        response.data.forEach((team: ITeam) => {
          if ( team.id === match.idTeamHome) {
            setTeamHome(team);
          }
          else {
            setTeamAway(team);
          }
        })
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listMatchLineups, match, teamAway, teamHome])

  useEffect(() => {
    if( listMatchLineups === null || listPlayers !== null) return;

    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: listMatchLineups.map((matchLineup) => matchLineup.idPlayer)
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        setListPlayers(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listMatchLineups, listPlayers])

  useEffect(() => {
    if( standingTeams !== null || match === null) return;
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: [match.idTeamHome, match.idTeamAway]
    }
    fetchStandingTeams(paramsFetchStandingTeams)
      .then(response => {
        setStandingTeams(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [match, standingTeams])

  const filterLineups = (matchLineups: IMatchLineup[], idTeam: number) => {
    return matchLineups.filter((matchLineup) => matchLineup.idTeam === idTeam);
  }

  return (
    <>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded &&  (
        <Scoreboard 
          match={match}
          standingTeams={standingTeams}
          teamAway={teamAway}
          teamHome={teamHome}
        />
      )}
      { isLoaded && (
        <>
          <TeamMatchResume
            key={`team-home-resume-${match.id}`}
            team={teamHome}
            matchLineups={filterLineups(listMatchLineups, teamHome.id)}
            match={match}
            players={listPlayers}
            teamHome={teamHome}
            teamAway={teamAway}
            hideHeader={true}
          />
          <TeamMatchResume
            key={`team-away-resume-${match.id}`}
            team={teamAway}
            matchLineups={filterLineups(listMatchLineups, teamAway.id)}
            match={match}
            players={listPlayers}
            teamHome={teamHome}
            teamAway={teamAway}
            hideHeader={true}
          />
        </>
      )}
    </>
  )
}

export default ViewMatchDetails;