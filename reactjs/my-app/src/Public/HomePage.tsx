import { useEffect, useState } from "react";

import { Alert, Box, CircularProgress, Grid } from "@mui/material";

import { IMatch } from "../Interfaces/match";

import { fetchMatches, IApiFetchMatchesParams } from "../ApiCall/matches";

import MatchResume from "../Matchs/MatchResume";

function HomePage() {

  const [apiError, changeApiError] = useState("");
  const [matchPast, setMatchPast] = useState<IMatch | null>(null);
  const [matchUpcoming, setMatchUpcoming] = useState<IMatch | null>(null);

  const isLoaded = matchPast !== null && matchUpcoming !== null;
  
  useEffect(() => {
    if( matchPast !== null) return;

    const queryParams: IApiFetchMatchesParams = {
      isPast: true,
      valueCompleted: 1,
      quantity: 1,
    }
    
    fetchMatches(queryParams)
      .then(response => {
        setMatchPast(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[matchPast]);

  useEffect(() => {
    if( matchPast !== null) return;

    const queryParams: IApiFetchMatchesParams = {
      isUpcoming: true,
      valueCompleted: 0,
      quantity: 1,
    }
    
    fetchMatches(queryParams)
      .then(response => {
        setMatchUpcoming(response.data[0]);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[matchPast]);

  return (
    <Box p={3}>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      <Grid container spacing={4} justifyContent="space-around">
        { matchPast && (
          <Grid item sm={12} md={6}  width="100%">
            <MatchResume 
              title="Latest match"
              match={matchPast}
            />
          </Grid>
        )}
        { matchUpcoming && (
          <Grid item sm={12} md={6}  width="100%">
            <MatchResume 
              title="Upcoming match"
              match={matchUpcoming}
            />
          </Grid>
        )}
      </Grid>
    </Box>
    
  )
}
export default HomePage;