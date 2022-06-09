import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Alert, Box, CircularProgress, IconButton, List, ListItem  } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { IMatch, IMatchProps } from "../Interfaces/Match";
import { ITeam } from '../Interfaces/Team';

import { fetchTeams } from '../ApiCall/teams';
import { fetchMatch, fetchMatchLineups } from '../ApiCall/matches';

function ViewMatch(props: IMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {idMatch, isAdmin} = props;

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [match, setMatch] = useState<IMatch | null>(null);
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  
  useEffect( () => {
    const getAllDatas = async() => {
      const matchData: IMatch = await fetchMatch(idMatch)
        .then(response => {
          setMatch(response.data[0])
          return response.data[0];
        })
        .catch(error => {
          changeApiError(error);
          return []
        })
        .finally(() => {
          // setIsLoaded(true)
        });
      
      console.log("Request Match data", match);
      
      await fetchTeams([matchData.idTeamHome, matchData.idTeamAway])
        .then(response => {
          console.log("receive Teams data", response.data);
          response.data.forEach((team: ITeam) => {
            console.log("Look for home/away team", team.id, matchData.idTeamHome);
            if ( team.id === matchData.idTeamHome) {
              setTeamHome(team);
              console.warn("Home team found");
            }
            else {
              setTeamAway(team);
              console.warn("Away team found");
            }
          })
        })
        .catch(error => {
          changeApiError(error);
        })
        .finally(() => {
          // setIsLoaded(true)
        });
      
      await fetchMatchLineups(idMatch)
        .then(response => {
          console.log("response Match Lineups", response.data);
          /* response.data.forEach((team: ITeam) => {
            if ( team.id === match?.idTeamHome) {
              setTeamHome(team);
            }
            else {
              setTeamAway(team);
            }
          }) */
        })
        .catch(error => {
          changeApiError(error);
        })
        .finally(() => {
          // setIsLoaded(true)
        });

      setIsLoaded(true)
      
    }
    getAllDatas();
    
    
  }, [dispatch])

  return (
    <>
      <h1>View Match #{idMatch}</h1>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { apiSuccess && <Alert severity="success">{apiSuccess}</Alert> }
      { isLoaded && match && teamHome && (
        <h2>Home Team: {teamHome.name}</h2>
        
      )}
      { isLoaded && match && teamAway && (
        <h2>Away Team: {teamAway.name}</h2>
      )}
    </>
  )
}

export default ViewMatch;