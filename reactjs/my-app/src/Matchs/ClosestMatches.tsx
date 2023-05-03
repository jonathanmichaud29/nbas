import { useEffect, useState } from "react";
import { batch } from "react-redux";

import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

import { IClosestMatchesProps, IMatch } from "../Interfaces/match";

import { IApiFetchMatchesParams, fetchMatches } from "../ApiCall/matches";

import LoaderInfo from "../Generic/LoaderInfo";
import MatchResume from "./MatchResume";



export default function ClosestMatches(props: IClosestMatchesProps) {

  const { leagueSeason } = props;

  const [apiError, changeApiError] = useState<string>('');
  const [matchPast, setMatchPast] = useState<IMatch | null>(null);
  const [matchUpcoming, setMatchUpcoming] = useState<IMatch | null>(null);
  const [matchesLoaded, setMatchesLoaded] = useState<boolean>(false);

  const isLoaded = matchesLoaded ? true : false;


  useEffect( () => {
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
        changeApiError(error);
      })
      .then((values) => {
        if( ! values ) return;

        batch(() => {
          setMatchPast(values[0].data[0] || null)
          setMatchUpcoming(values[1].data[0] || null);
          setMatchesLoaded(true);
        })
      })
      .finally(()=>{
        setMatchesLoaded(true);
      });
    
  }, [leagueSeason])

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { ( matchesLoaded && ( matchPast || matchUpcoming ) ) ? (
        <Paper component={Box} m={3} p={3}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h1">
              Closest Match
            </Typography>
            <Grid container justifyContent="space-around" rowSpacing={3}>
              { matchPast && (
                <Grid item sm={12} md={6} sx={{maxWidth:'100%'}}>
                  <MatchResume 
                    title="Latest match"
                    match={matchPast}
                  />
                </Grid>
              )}
              { matchUpcoming && (
                <Grid item sm={12}  md={6} sx={{maxWidth:'100%'}}>
                  <MatchResume 
                    title="Upcoming match"
                    match={matchUpcoming}
                  />
                </Grid>
              )}
            </Grid>
          </Stack>
        </Paper>
      ) : '' }
      
    </>
  )
}

