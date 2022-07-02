import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";
import { addPlayers } from "../redux/playerSlice";

import { Alert, Box, CircularProgress, IconButton } from "@mui/material";
import FactCheckIcon from '@mui/icons-material/FactCheck';

import { IMatchProps } from "../Interfaces/match";
import { ITeam } from '../Interfaces/team';

import { fetchTeams, IApiFetchTeamsParams } from '../ApiCall/teams';
import { fetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import TeamMatchLineup from '../Teams/TeamMatchLineup';
import CompleteMatch from '../Modals/CompleteMatch';

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
    if( teamHome !== null && teamAway !== null) return;
    
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [match.idTeamHome, match.idTeamAway]
    }
    fetchTeams(paramsFetchTeams)
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

    const paramsFetchPlayers: IApiFetchPlayersParams = {
      allPlayers: true
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        dispatch(addPlayers(response.data));
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() =>{
        setLoadingPlayers(true);
      })
  }, [dispatch, match, teamAway, teamHome]);


  /**
   * Handle modals
   */

  const [isModalOpenCompleteMatch, setModalOpenCompleteMatch] = useState(false);
  const handleOpenCompleteMatch = () => {
    setModalOpenCompleteMatch(true);
  }
  const cbCloseCompleteMatch = () => {
    setModalOpenCompleteMatch(false);
  }
  return (
    <>
      <h1>View Match #{match.id}</h1>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      {/* { apiSuccess && <Alert severity="success">{apiSuccess}</Alert> } */}
      { isLoaded && (
        <IconButton 
          key={`complete-match-${match.id}`}
          aria-label={`Complete match statistics`}
          title={`Complete match statistics`}
          onClick={ () => handleOpenCompleteMatch() }
          >
          <FactCheckIcon />
        </IconButton>
      )}
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
      { /* isAdmin &&  */isLoaded && isModalOpenCompleteMatch && (
        <CompleteMatch
          key={`modal-complete-match-${match.id}`}
          isOpen={isModalOpenCompleteMatch}
          match={match}
          teamHome={teamHome}
          teamAway={teamAway}
          callbackCloseModal={cbCloseCompleteMatch}
          allPlayers={listPlayers}
          />
      )}
    </>
  )
}

export default ViewMatch;