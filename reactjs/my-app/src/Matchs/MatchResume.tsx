import { useEffect, useState } from "react";

import { Alert, Box, Card, CardContent, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';

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
    <Card>
      <CardContent>
        <Grid container spacing={1} alignItems="baseline" justifyContent="center">
          <Grid item><SportsBaseballIcon color="primary"/></Grid>
          <Grid item>
            <Typography variant="h4" component="h2" color="textPrimary">
              {title}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      
      { isLoaded && (
        <CardContent>
          <Scoreboard 
            teamHome={teamHome}
            teamAway={teamAway}
            match={match}
            standingTeams={standingTeams}
          /> 
        </CardContent>
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

    </Card>
  )
}

export default MatchResume;