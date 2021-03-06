import { useState, useEffect } from 'react';

import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography  } from "@mui/material";

import { IPlayer } from "../Interfaces/player";
import { IMatchLineup } from '../Interfaces/match';

import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchMatchLineups, IApiFetchMatchLineups } from '../ApiCall/matches';

import { setMetas } from '../utils/metaTags';

import YearStats from '../Stats/YearStats';

function PublicPlayersStats() {

  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listMatchesLineups, setListMatchesLineups] = useState<IMatchLineup[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = listPlayers !== null && listMatchesLineups !== null;

  setMetas({
    title:`Players batting statistics`,
    description:`League players batting statistics this season`
  });
  
  /**
   * Fetch Players
   */
  useEffect( () => {
    if ( listPlayers !== null ) return;
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      allPlayers: true
    }
    fetchPlayers(paramsFetchPlayers)
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
    const paramsMatchLineups: IApiFetchMatchLineups = {
      allLineups: true,
    }
    fetchMatchLineups(paramsMatchLineups)
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
    <Box p={3}>
      <Card>
        <CardContent>
          <Grid container alignItems="center" justifyContent="center" flexDirection="column">
            <Grid item xs={12} style={{width:"100%"}}>
              <Typography variant="h2" component="h1" align='center'>League Players Standing</Typography>
            </Grid>
            { ! isLoaded && <Box><CircularProgress /></Box>}
            { apiError && <Alert severity="error">{apiError}</Alert> }
            { isLoaded && (
              <Grid item xs={12} style={{width:"100%"}} >
                <YearStats
                  key={`year-players-stat`}
                  matchLineups={listMatchesLineups}
                  players={listPlayers}
                  title={`League batting stats`}
                /> 
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
export default PublicPlayersStats;