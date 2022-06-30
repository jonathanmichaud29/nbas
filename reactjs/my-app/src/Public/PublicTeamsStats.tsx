import { useState, useEffect } from 'react';

import { Alert, Box, CircularProgress, Typography  } from "@mui/material";

import { IPlayer } from "../Interfaces/player";
import { IMatchLineup } from '../Interfaces/match';
import { ITeam, IStandingTeam } from '../Interfaces/team';

import { fetchPlayers } from '../ApiCall/players';
import { fetchMatchesLineups } from '../ApiCall/matches';
import { fetchStandingTeams, fetchTeams } from '../ApiCall/teams';

import AllTeamsStanding from '../Teams/AllTeamsStanding';
import AllTeamsStats from '../Teams/AllTeamsStats';

import {setMetas} from '../utils/metaTags';

function PublicTeamsStats() {

  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [standingTeams, setStandingTeams] = useState<IStandingTeam[] | null>(null);
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listMatchesLineups, setListMatchesLineups] = useState<IMatchLineup[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = listTeams !== null && listPlayers !== null && listMatchesLineups !== null && standingTeams !== null;

  setMetas({
    title:`Teams standing this season`,
    description:`NBAS teams standing this season including team batting statistics`
  });

  /**
   * Fetch Teams
   */
   useEffect( () => {
    if ( listTeams !== null ) return;
    fetchTeams()
      .then(response => {
        setListTeams(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listTeams]);
  
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

  useEffect(() => {
    if( standingTeams !== null || listTeams === null) return;
    const idTeams = listTeams.map((team) => team.id)
    fetchStandingTeams(idTeams)
      .then(response => {
        const newStandingTeams: IStandingTeam[] = response.data;
        newStandingTeams.sort((a,b) => b.nbWins - a.nbWins || a.nbGamePlayed - b.nbGamePlayed );
        setStandingTeams(response.data);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listTeams, standingTeams])

  return (
    <div className="public-layout">
      <Typography component="h1" variant="h3">
        League Teams Standing
      </Typography>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && (
        <AllTeamsStanding 
          teams={listTeams}
          standingTeams={standingTeams}
        />
      ) }
      { isLoaded && (
        <AllTeamsStats 
          teams={listTeams}
          matchesLineups={listMatchesLineups}
        />
      ) }
    </div>
  )
}
export default PublicTeamsStats;