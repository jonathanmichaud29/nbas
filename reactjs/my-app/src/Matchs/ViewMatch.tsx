import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";
import { addPlayers } from "../redux/playerSlice";

import { Alert, Box, CircularProgress } from "@mui/material";

import { IMatchProps } from "../Interfaces/Match";
import { ITeam } from '../Interfaces/Team';

import { fetchTeams } from '../ApiCall/teams';
import { fetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers } from '../ApiCall/players';

import TeamMatchLineup from '../Teams/TeamMatchLineup';


function ViewMatch(props: IMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {match, isAdmin} = props;

  const [apiError, changeApiError] = useState("");
  /* const [apiSuccess, changeApiSuccess] = useState(""); */

  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const listPlayers = useSelector((state: RootState) => state.players )

  const isLoaded = teamHome && teamAway && loadingPlayers;

  /**
   * Fetch Teams details
   */
  useEffect( () => {
    if( match === null ) return;
    fetchTeams([match.idTeamHome, match.idTeamAway])
      .then(response => {
        response.data.forEach((team: ITeam) => {
          if ( team.id === match.idTeamHome) {
            setTeamHome(team);
          }
          else {
            setTeamAway(team);
          }
        })
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
    fetchMatchLineups(match.id)
      .then(response => {
        dispatch(addMatchPlayers(match, response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
    fetchPlayers()
      .then(response => {
        dispatch(addPlayers(response.data));
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() =>{
        setLoadingPlayers(true);
      })
  }, [dispatch, match]);


  return (
    <>
      <h1>View Match #{match.id}</h1>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      {/* { apiSuccess && <Alert severity="success">{apiSuccess}</Alert> } */}
      { isLoaded && teamHome && (
        <TeamMatchLineup 
          key={`team-home-lineup-${match.id}`}
          isAdmin={isAdmin}
          isHomeTeam={true}
          match={match}
          team={teamHome}
          allPlayers={listPlayers}
        />
      )}
      { isLoaded && teamAway && (
        <TeamMatchLineup 
          key={`team-away-lineup-${match.id}`}
          isAdmin={isAdmin}
          isHomeTeam={false}
          match={match}
          team={teamAway}
          allPlayers={listPlayers}
        />
      )}
    </>
  )
}

export default ViewMatch;