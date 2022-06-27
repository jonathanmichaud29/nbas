import { useState, useEffect } from 'react';

import { Alert, Box, CircularProgress  } from "@mui/material";

import { IPlayer } from "../Interfaces/player";
import { IMatch, IMatchLineup } from '../Interfaces/match';
import { ITeam, ITeamStanding } from '../Interfaces/team';

import { fetchPlayers } from '../ApiCall/players';
import { fetchMatches, fetchMatchesLineups } from '../ApiCall/matches';
import { fetchTeams } from '../ApiCall/teams';



import AllTeamsStanding from '../Teams/AllTeamsStanding';
import AllTeamsStats from '../Teams/AllTeamsStats';


function PublicTeamsStats() {

  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listStandingTeams, setListStandingTeams] = useState<ITeamStanding[] | null>(null);
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchesLineups, setListMatchesLineups] = useState<IMatchLineup[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = listMatches !== null && listTeams !== null && listPlayers !== null && listMatchesLineups !== null && listStandingTeams !== null;

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
    if( listMatches !== null) return;
    fetchMatches()
      .then(response => {
        setListMatches(response.data);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listMatches])

  useEffect(() => {
    if( listStandingTeams !== null || listMatches === null || listTeams === null ) return;
    let newStandingTeams = listTeams.map((team) => {
      return {
        idTeam: team.id,
        gamePlayed: 0,
        win: 0,
        lost: 0,
      } as ITeamStanding
    });

    const completedMatches = listMatches.filter((match) => match.isCompleted === 1);
    completedMatches.every((match) => {
      let standingTeam = newStandingTeams.find((standingTeam) => match.idTeamWon === standingTeam.idTeam);
      if( standingTeam !== undefined ){
        standingTeam.gamePlayed++;
        standingTeam.win++;
      }

      standingTeam = newStandingTeams.find((standingTeam) => match.idTeamLost === standingTeam.idTeam);
      if( standingTeam !== undefined ){
        standingTeam.gamePlayed++;
        standingTeam.lost++;
      }
      
      return true;
    })
    // Sort teams results by highest win, secondary by lowest game played
    newStandingTeams.sort((a,b) => b.win - a.win || a.gamePlayed - b.gamePlayed );
    setListStandingTeams(newStandingTeams);
  }, [listMatches, listStandingTeams, listTeams]);

  return (
    <div className="public-layout">
      <h1>League Teams Standing</h1>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && (
        <AllTeamsStanding 
          teams={listTeams}
          standings={listStandingTeams}
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