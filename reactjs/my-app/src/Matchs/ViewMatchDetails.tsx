
import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress } from "@mui/material";

import { fetchMatchLineups } from '../ApiCall/matches';
import { fetchTeams } from '../ApiCall/teams';
import { fetchSpecificPlayers } from '../ApiCall/players';

import { ITeam } from '../Interfaces/team'
import { IMatchDetailsProps, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'

import TeamMatchResume from '../Teams/TeamMatchResume'
/* import YearStats from '../Stats/YearStats' */

import { createDateReadable } from '../utils/dateFormatter'

function ViewMatchDetails(props: IMatchDetailsProps) {

  const { match } = props;

  const [apiError, changeApiError] = useState("");
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);

  const isLoaded = listMatchLineups !== null && teamHome !== null && teamAway !== null && listPlayers !== null;

  const dateReadable = createDateReadable(match.date);

  useEffect(() => {
    if( listMatchLineups !== null && teamHome !== null && teamAway !== null ) return;
    fetchMatchLineups(match.id)
      .then((response) => {
        /* setListPlayers(response.data.players);
        setListTeams(response.data.teams);
        setListMatches(response.data.matches);*/
        setListMatchLineups(response.data);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
    fetchTeams([match.idTeamHome, match.idTeamAway])
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
  }, [listMatchLineups, match.id, match.idTeamAway, match.idTeamHome, teamAway, teamHome])

  useEffect(() => {
    if( listMatchLineups === null || listPlayers !== null) return;
    const listPlayerIds = listMatchLineups.map((matchLineup) => matchLineup.idPlayer);
    fetchSpecificPlayers(listPlayerIds)
      .then(response => {
        setListPlayers(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listMatchLineups, listPlayers])

  const filterLineups = (matchLineups: IMatchLineup[], idTeam: number) => {
    return matchLineups.filter((matchLineup) => matchLineup.idTeam === idTeam);
  }

  const htmlMatchSummary = () => {
    if( isLoaded && match.isCompleted ) {
      const teamNameWin = match.idTeamWon === teamHome.id ? teamHome.name : teamAway.name;
      return (
        <p> {teamNameWin} wins! {match.teamHomePoints} VS {match.teamAwayPoints}</p>
      );
    }
    else {
      return (
        <p>This match is not completed</p>
      )
    }
  }

  return (
    <>
      <h2>{dateReadable} : {teamHome && teamAway ? `${teamHome.name} VS ${teamAway.name}` : `Match #{match.id}`}</h2>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { htmlMatchSummary() }
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
      {/* { isLoaded && (
        <YearStats
          key={`match-year-stat-${match.id}`}
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
      })} */}
    </>
  )
}

export default ViewMatchDetails;