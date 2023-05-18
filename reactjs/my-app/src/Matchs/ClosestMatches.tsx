import { useEffect, useState } from "react";
import { batch } from "react-redux";

import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

import { IMatch } from "../Interfaces/match";
import { ILeagueSeason } from "../Interfaces/league";

import { IApiFetchMatchesParams, fetchMatches } from "../ApiCall/matches";

import LoaderInfo from "../Generic/LoaderInfo";
import MatchResume from "./MatchResume";


interface IClosestMatchesProps {
  leagueSeason: ILeagueSeason;
}

export default function ClosestMatches(props: IClosestMatchesProps) {

  const { leagueSeason } = props;

  const [apiError, changeApiError] = useState<string>('');
  const [matchPast, setMatchPast] = useState<IMatch | null>(null);
  const [matchUpcoming, setMatchUpcoming] = useState<IMatch | null>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect( () => {
    let newError: string = '';
    let newMatchPast: IMatch | null = null;
    let newMatchUpcoming: IMatch | null = null;

    const queryPastParams: IApiFetchMatchesParams = {
      isPast: true,
      valueCompleted: 1,
      quantity: 1,
      leagueSeasonIds: [leagueSeason.id]
    }
    const queryUpcomingParams: IApiFetchMatchesParams = {
      isUpcoming: true,
      valueCompleted: 0,
      quantity: 1,
      leagueSeasonIds: [leagueSeason.id]
    }
    Promise.all([fetchMatches(queryPastParams), fetchMatches(queryUpcomingParams)])
      .catch((error)=>{
        newError = error;
        
      })
      .then((values) => {
        if( ! values ) return;

        newMatchPast = values[0].data[0] || null;
        newMatchUpcoming = values[1].data[0] || null;
      })
      .finally(()=>{
        batch(() => {
          changeApiError(newError);
          setMatchPast(newMatchPast)
          setMatchUpcoming(newMatchUpcoming);
          setDataLoaded(true);
        });
      });
    
  }, [leagueSeason])

  return (
    <>
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { dataLoaded ? 
        <Paper component={Box} m={3} pt={3} pb={3}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h1">
              Closest Match
            </Typography>
            <Grid container rowSpacing={3}>
              <Grid item sm={12} md={6} sx={{maxWidth:'100%'}}>
                <MatchResume 
                  title="Latest match"
                  match={matchPast}
                />
              </Grid>
              <Grid item sm={12}  md={6} sx={{maxWidth:'100%'}}>
                <MatchResume 
                  title="Upcoming match"
                  match={matchUpcoming}
                /> 
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      : '' }
      
    </>
  )
}

