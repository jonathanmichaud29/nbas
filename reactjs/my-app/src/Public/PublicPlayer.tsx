import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { Alert, Box, CircularProgress  } from "@mui/material";

import { IPlayer } from "../Interfaces/Player";

import { fetchPlayer } from '../ApiCall/players';

import ViewPlayerProfile from '../Players/ViewPlayerProfile';

function PublicPlayer() {
  let { id } = useParams();
  const idPlayer = id ? parseInt(id, 10) : null;

  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = player !== null;

  
  /**
   * Fetch Match details
   */
  useEffect( () => {
    if ( idPlayer === null ) return;

    fetchPlayer(idPlayer)
      .then(response => {
        setPlayer(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [idPlayer]);

  return (
    <div className="public-layout">
      <h1>Public player</h1>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { player && (
        <ViewPlayerProfile 
          player={player}
        />
      ) }
    </div>
  )
}
export default PublicPlayer;