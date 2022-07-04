import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";

import MatchResume from "../Matchs/MatchResume";
import { IMatch } from "../Interfaces/match";
import { fetchMatches, IApiFetchMatchesParams } from "../ApiCall/matches";



function HomePage() {

  const [apiError, changeApiError] = useState("");
  const [matchPast, setMatchPast] = useState<IMatch | null>(null);
  const [matchUpcoming, setMatchUpcoming] = useState<IMatch | null>(null);

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