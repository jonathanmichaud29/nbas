import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import FactCheckIcon from '@mui/icons-material/FactCheck';

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";
import { addPlayers } from "../redux/playerSlice";

import { IMatchProps } from "../Interfaces/match";
import { ITeam } from '../Interfaces/team';

import { fetchTeams, IApiFetchTeamsParams } from '../ApiCall/teams';
import { fetchMatchLineups, IApiFetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';

import { getStorageLeagueName } from '../utils/localStorage';
import { createHumanDate } from '../utils/dateFormatter';

import LoaderInfo from '../Generic/LoaderInfo';
import TeamMatchLineup from '../Teams/TeamMatchLineup';
import CompleteMatch from '../Modals/CompleteMatch';

function ViewMatch(props: IMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {match, isAdmin} = props;

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");

  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const listPlayers = useSelector((state: RootState) => state.players )

  const isLoaded = ( teamHome && teamAway && loadingPlayers ? true : false);

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
    const paramsMatchLineups: IApiFetchMatchLineups = {
      matchId: match.id
    }
    fetchMatchLineups(paramsMatchLineups)
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
  const handleOpenCompleteMatch = () => {
    setModalOpenCompleteMatch(true);
  }
  const cbCloseCompleteMatch = () => {
    setModalOpenCompleteMatch(false);
  }

  const currentLeagueName = getStorageLeagueName();
  const dateReadable = createHumanDate(match.date);
  return (
    <>
      <Paper component={Box} p={3} m={3}>
        <Stack spacing={3} alignItems="center" >
          <Typography variant="h1">
            {currentLeagueName}
          </Typography>
          <Typography component="h2" variant="h4">
            Match #{match.id} - {dateReadable}
          </Typography>
          
          { isLoaded && teamHome && teamAway && (
            <Typography component="h3" variant="h4">
              {teamHome.name} vs {teamAway.name}
            </Typography>
          )}
          { isLoaded && (
            <Button variant="contained" startIcon={<FactCheckIcon />} onClick={ () => handleOpenCompleteMatch() }>
              Complete match statistics
            </Button>
          )}
          <LoaderInfo
            isLoading={isLoaded}
            msgError={apiError}
            msgSuccess={apiSuccess}
          />
        </Stack>
      </Paper>
      
      { isLoaded && teamHome && teamAway && (
        <Box p={3}>
          <Grid container direction="row" alignItems="flex-start" justifyContent="space-between" spacing={3}>
            <Grid item xs={12} sm={6} alignItems="center">
              <TeamMatchLineup 
                key={`team-home-lineup-${match.id}`}
                isAdmin={isAdmin}
                isHomeTeam={true}
                match={match}
                team={teamHome}
                allPlayers={listPlayers}
              />
            </Grid>
            <Grid item xs={12} sm={6} alignItems="center">
              <TeamMatchLineup 
                key={`team-away-lineup-${match.id}`}
                isAdmin={isAdmin}
                isHomeTeam={false}
                match={match}
                team={teamAway}
                allPlayers={listPlayers}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      { teamHome && teamAway && isModalOpenCompleteMatch && (
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