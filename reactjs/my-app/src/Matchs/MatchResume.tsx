import { useEffect, useState } from "react";
import { batch } from "react-redux";

import { Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';

import { IMatchResumeProps } from '../Interfaces/match'
import { ITeam, IStandingTeam } from "../Interfaces/team";

import { fetchTeams, fetchStandingTeams, IApiFetchTeamsParams, IApiFetchStandingTeamsParams } from "../ApiCall/teams";

import Scoreboard from './Scoreboard';
import BestMatchPlayers from '../Players/BestMatchPlayers'
import LoaderInfo from "../Generic/LoaderInfo";


function MatchResume(props: IMatchResumeProps) {
  
  const { title, match } = props;

  const [apiError, changeApiError] = useState("");
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[]>([]);
  
  const isLoaded = teamHome !== null && teamAway !== null && standingTeams.length > 0;

  useEffect(() => {
    const listTeamIds = [match.idTeamHome, match.idTeamAway]
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: listTeamIds,
    }
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: listTeamIds,
      seasonId: match.idSeason
    }
    Promise.all([fetchStandingTeams(paramsFetchStandingTeams), fetchTeams(paramsFetchTeams)])
      .catch((error)=>{
        changeApiError(error);
      })
      .then((values) => {
        if( ! values ) return;

        batch(() => {
          setStandingTeams(values[0].data)
          values[1].data.forEach((team: ITeam) => {
            if ( team.id === match.idTeamHome) {
              setTeamHome(team);
            }
            else {
              setTeamAway(team);
            }
          })
        })
      })
      .finally(()=>{

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
          { isLoaded ? (
            <Scoreboard
              teamHome={teamHome}
              teamAway={teamAway}
              match={match}
              standingTeams={standingTeams}
              hasLinkMatchDetails={true}
            /> 
          ) : ''}
          <Typography variant="h3" textAlign="center">Best players this {match.isCompleted === 0 ? 'season' : 'game'}</Typography>
          { isLoaded ? (
            <BestMatchPlayers 
              match={match}
              team={teamHome}
            />
          ) : ''}
          { isLoaded ? (
            <BestMatchPlayers 
              match={match}
              team={teamAway}
            />
          ) : ''}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default MatchResume;