import { useState, useEffect } from 'react';

import { Alert, Box, CircularProgress  } from "@mui/material";

import { IPlayer } from "../Interfaces/player";
import { IMatchLineup } from '../Interfaces/match';
import { IPlayerStatsExtended } from '../Interfaces/stats';

import { fetchPlayers } from '../ApiCall/players';
import { fetchMatchesLineups } from '../ApiCall/matches';


import YearStats from '../Stats/YearStats';

function PublicPlayersStats() {

  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listMatchesLineups, setListMatchesLineups] = useState<IMatchLineup[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = listPlayers !== null && listMatchesLineups !== null;

  
  /**
   * Fetch Players
   */
  useEffect( () => {
    if ( listPlayers !== null ) return;
    fetchPlayers()
      .then(response => {
        setListPlayers(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listPlayers]);

  /**
   * Fetch Matches Lineups
   */
   useEffect( () => {
    if ( listMatchesLineups !== null ) return;
    fetchMatchesLineups()
      .then(response => {
        setListMatchesLineups(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listMatchesLineups]);

  return (
    <div className="public-layout">
      <h1>Players Stats</h1>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && (
        <YearStats
          key={`year-players-stat`}
          matchLineups={listMatchesLineups}
          players={listPlayers}
        /> 
      )}
    </div>
  )
}
export default PublicPlayersStats;