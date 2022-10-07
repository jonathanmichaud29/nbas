import { useMemo, useState } from "react";

import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

import { IClosestMatchesProps, IMatch } from "../Interfaces/match";

import { IApiFetchMatchesParams, fetchMatches } from "../ApiCall/matches";

import LoaderInfo from "../Generic/LoaderInfo";
import MatchResume from "./MatchResume";


export default function ClosestMatches(props: IClosestMatchesProps) {

  const { league } = props;

  const [apiError, changeApiError] = useState<string>('');
  const [matchPast, setMatchPast] = useState<IMatch | null>(null);
  const [matchUpcoming, setMatchUpcoming] = useState<IMatch | null>(null);
  const [matchPastLoaded, setMatchPastLoaded] = useState<boolean>(false);
  const [matchUpcomingLoaded, setMatchUpcomingLoaded] = useState<boolean>(false);

  const isLoaded = matchPastLoaded && matchUpcomingLoaded ? true : false;


  useMemo(() => {
    
    const queryPastParams: IApiFetchMatchesParams = {
      isPast: true,
      valueCompleted: 1,
      quantity: 1,
      leagueIds: [league.id]
    }
    
    fetchMatches(queryPastParams)
      .then(response => {
        setMatchPast(response.data[0] || null)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setMatchPastLoaded(true);
      });

    const queryUpcomingParams: IApiFetchMatchesParams = {
      isUpcoming: true,
      valueCompleted: 0,
      quantity: 1,
      leagueIds: [league.id]
    }
      
    fetchMatches(queryUpcomingParams)
      .then(response => {
        setMatchUpcoming(response.data[0] || null);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setMatchUpcomingLoaded(true);
      });
  }, [league])

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { (matchPast || matchUpcoming) && (
        <Paper component={Box} m={3} p={3}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h1">
              Closest Match for {league.name}
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
      ) }
      
    </>
  )
}

