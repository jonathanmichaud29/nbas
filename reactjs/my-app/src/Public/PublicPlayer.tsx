import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { Alert, Box, CircularProgress} from "@mui/material";

import { IPlayer } from "../Interfaces/player";

import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import ViewPlayerProfile from '../Players/ViewPlayerProfile';

import { setMetas } from '../utils/metaTags';

function PublicPlayer() {
  let { id } = useParams();
  const idPlayer = id ? parseInt(id, 10) : null;

  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = player !== null;

  if( isLoaded ){
    setMetas({
      title:`${player.name} Player profile`,
      description:`NBAS ${player.name} profile that included its standing, batting stats and each match summary played this season`
    });
  }
  
  /**
   * Fetch Match details
   */
  useEffect( () => {
    if ( idPlayer === null ) return;
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: [idPlayer]
    }
    fetchPlayers(paramsFetchPlayers)
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
    <Box p={3}>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { player && (
        <ViewPlayerProfile 
          player={player}
        />
      ) }
    </Box>
  )
}
export default PublicPlayer;