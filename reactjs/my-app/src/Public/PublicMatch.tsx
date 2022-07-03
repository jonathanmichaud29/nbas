import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { Alert, Box, CircularProgress  } from "@mui/material";

import { IMatch } from "../Interfaces/match";

import { fetchMatches, IApiFetchMatchesParams } from '../ApiCall/matches';

import ViewMatchDetails from '../Matchs/ViewMatchDetails';

function PublicMatch() {
  let { id } = useParams();
  const idMatch = id ? parseInt(id, 10) : null;

  const [match, setMatch] = useState<IMatch | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = match !== null;

  
  /**
   * Fetch Match details
   */
  useEffect( () => {
    if ( idMatch === null ) return;
    const paramsFetchMatches: IApiFetchMatchesParams = {
      matchIds: [idMatch]
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        setMatch(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [idMatch]);

  return (
    <>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && (
        <ViewMatchDetails 
          match={match}
        />
      ) }
    </>
  )
}
export default PublicMatch;