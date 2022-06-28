import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import { fetchSingleMatch, IFetchSingleMatchParams } from "../ApiCall/matches";
import { fetchTeams, fetchStandingTeams } from "../ApiCall/teams";

import { IMatch, IMatchResumeProps } from '../Interfaces/match'
import { ITeam, IStandingTeam } from "../Interfaces/team";

import Scoreboard from './Scoreboard';
import BestStatPlayers from '../Players/BestStatPlayers'

function MatchResume(props: IMatchResumeProps) {
  
  const { title, isLatestMatch } = props;

  const [apiError, changeApiError] = useState("");
  const [match, setMatch] = useState<IMatch | null>(null);
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[] | null>(null);

  const isLoaded = match !== null && teamHome !== null && teamAway !== null && standingTeams !== null;

  useEffect(() => {
    if( match !== null ) return;

    const queryParams: IFetchSingleMatchParams = isLatestMatch ? {
      isLast: true,
      valueCompleted: 1,
    } : {
      isUpcoming: true,
      valueCompleted: 0,
    }
    fetchSingleMatch(queryParams)
      .then(response => {
        setMatch(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[isLatestMatch, match]);

  useEffect(() => {
    if( match === null || teamHome !== null || teamAway !== null) return;
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
  }, [match, teamAway, teamHome])

  useEffect(() => {
    if( standingTeams !== null || match === null) return;
    fetchStandingTeams([match.idTeamHome, match.idTeamAway])
      .then(response => {
        setStandingTeams(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [match, standingTeams])

  return (
    <>
      
      <Typography variant="h4" component="h2">
        {title}
      </Typography>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && (
        <Scoreboard 
          teamHome={teamHome}
          teamAway={teamAway}
          match={match}
          standingTeams={standingTeams}
        /> 
      )}
      { isLoaded &&
        <BestStatPlayers 
          match={match}
          team={teamHome}
        />
      }
      { isLoaded &&
        <BestStatPlayers 
          match={match}
          team={teamAway}
        />
      }

    </>
  )
}

export default MatchResume;