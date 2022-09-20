import { useMemo, useState } from "react";

import { Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';

import { IMatchResumeProps } from '../Interfaces/match'
import { ITeam, IStandingTeam } from "../Interfaces/team";

import { fetchTeams, fetchStandingTeams, IApiFetchTeamsParams, IApiFetchStandingTeamsParams } from "../ApiCall/teams";

import Scoreboard from './Scoreboard';
import BestStatPlayers from '../Players/BestStatPlayers'
import LoaderInfo from "../Generic/LoaderInfo";

function MatchResume(props: IMatchResumeProps) {
  
  const { title, match } = props;

  const [apiError, changeApiError] = useState("");
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[] | null>(null);

  const isLoaded = teamHome !== null && teamAway !== null && standingTeams !== null;

  useMemo(() => {
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [match.idTeamHome, match.idTeamAway],
      leagueIds: [match.idLeague]
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
  }, [match])

  useMemo(() => {
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
  }, [match])


  return (
    <Card>
      <CardContent>
        <Grid container spacing={1} alignItems="baseline" justifyContent="center">
          <Grid item><SportsBaseballIcon color="primary"/></Grid>
          <Grid item>
            <Typography variant="h2" color="textPrimary" textAlign="center">
              {title}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      
      <Divider />

      <CardContent>
        <Stack spacing={3}>
          <LoaderInfo
            isLoading={isLoaded}
            msgError={apiError}
          />
          { isLoaded && (
            <Scoreboard
              teamHome={teamHome}
              teamAway={teamAway}
              match={match}
              standingTeams={standingTeams}
              hasLinkMatchDetails={true}
            /> 
          )}
          <Typography variant="h3" textAlign="center">Best players this {match.isCompleted === 0 ? 'season' : 'game'}</Typography>
          { isLoaded && (
            <BestStatPlayers 
              match={match}
              team={teamHome}
            />
          )}
          { isLoaded && (
            <BestStatPlayers 
              match={match}
              team={teamAway}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default MatchResume;