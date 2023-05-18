import { useEffect, useState } from "react";
import { batch } from "react-redux";

import { Box, Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';

import { usePublicContext } from "../Public/PublicApp";

import { IStandingTeam } from "../Interfaces/team";
import { IMatch, IMatchLineup } from "../Interfaces/match";

import { fetchStandingTeams, IApiFetchStandingTeamsParams } from "../ApiCall/teams";
import { IApiFetchMatchLineups, fetchMatchLineups } from "../ApiCall/matches";

import Scoreboard from './Scoreboard';
import BestMatchPlayers from '../Players/BestMatchPlayers'
import LoaderInfo from "../Generic/LoaderInfo";

interface IMatchResumeProps {
  title: string;
  match: IMatch | null;
}

function MatchResume(props: IMatchResumeProps) {
  
  const { title, match } = props;

  const { leagueSeasonTeams } = usePublicContext();

  const [apiError, changeApiError] = useState("");
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[]>([]);
  const [matchLineups, setMatchLineups] = useState<IMatchLineup[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(match === null);

  const teamHome = leagueSeasonTeams.find((team) => team.id === match?.idTeamHome) || null;
  const teamAway = leagueSeasonTeams.find((team) => team.id === match?.idTeamAway) || null;
  
  useEffect(() => {
    if( match === null ) {
      return;
    }

    let newError: string = '';
    let newTeamStanding: IStandingTeam[] = [];
    let newMatchLineups: IMatchLineup[] = [];

    const listTeamIds = [match.idTeamHome, match.idTeamAway]
    
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: listTeamIds,
      seasonId: match.idSeason
    }
    const paramsMatchLineups:IApiFetchMatchLineups = {
      matchId:match.id,
      leagueSeasonIds:[match.idSeason]
    }
    Promise.all([fetchStandingTeams(paramsFetchStandingTeams), fetchMatchLineups(paramsMatchLineups)])
      .catch((error)=>{
        newError = error;
      })
      .then((values) => {
        if( ! values ) return;

        newTeamStanding = values[0].data;
        
        newMatchLineups = values[1].data;
      })
      .finally(()=>{
        batch(() => {
          changeApiError(newError);
          setStandingTeams(newTeamStanding);
          setMatchLineups(newMatchLineups);
          setDataLoaded(true);
        })
        
      });
    
  }, [match])



  return (
    <Card component={Box} m={3} mt={0} raised={true}>
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
      { match === null 
      ?
        <LoaderInfo
          msgWarning="No match found"
        />
      : 
        <CardContent>
          <Stack spacing={3}>
            <LoaderInfo
              isLoading={dataLoaded}
              msgError={apiError}
            />
            { dataLoaded && teamHome && teamAway ? (
              <>
                <Scoreboard
                  teamHome={teamHome}
                  teamAway={teamAway}
                  match={match}
                  standingTeams={standingTeams}
                  hasLinkMatchDetails={true}
                /> 
                <Divider />
                <Typography variant="h3" textAlign="center">{`Best players this ` + ( match?.isCompleted === 0 ? 'season' : 'game' )}</Typography>
                <BestMatchPlayers 
                  match={match}
                  team={teamHome}
                  matchLineups={matchLineups}
                />
                <BestMatchPlayers 
                  match={match}
                  matchLineups={matchLineups}
                  team={teamAway}
                />
              </>
            ) : ''}
            
          </Stack>
        </CardContent>
      }
    </Card>
  )
}

export default MatchResume;