import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom'

import { IMatch, IMatchLineup } from "../Interfaces/match";

import { fetchMatches, fetchMatchLineups, IApiFetchMatchesParams, IApiFetchMatchLineups } from '../ApiCall/matches';

import AdminMatchHeader from '../Matchs/AdminMatchHeader';
import LoaderInfo from '../Generic/LoaderInfo';
import { castNumber } from '../utils/castValues';
import { fetchTeams, IApiFetchTeamsParams } from '../ApiCall/teams';
import { ITeam } from '../Interfaces/team';
import { Box, Grid } from '@mui/material';
import TeamMatchLineup from '../Teams/TeamMatchLineup';
import { addMatchPlayers } from '../redux/matchPlayerSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { addPlayers } from '../redux/playerSlice';

function MatchManager() {
  const dispatch = useDispatch<AppDispatch>();
  
  let { id } = useParams();
  const idMatch = castNumber(id);

  const [match, setMatch] = useState<IMatch | null>(null);
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [apiError, changeApiError] = useState("");
  
  const isLoaded = match !== null && teamHome !== null && teamAway !== null;

  /**
   * Fetch Match details & Teams
   */
  useMemo( () => {
    const paramsFetchMatches: IApiFetchMatchesParams = {
      matchIds: [idMatch]
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        const rowMatch: IMatch = response.data[0];
        setMatch(rowMatch);

        // Fetch All Players from this league
        const paramsFetchPlayers: IApiFetchPlayersParams = {
          allPlayers:true
        }
        fetchPlayers(paramsFetchPlayers)
          .then(response => {
            dispatch(addPlayers(response.data));
          })
          .catch((error) => {
            changeApiError(error);
          })
          .finally(() =>{
            
          })
        
        // Fetch Teams
        const paramsFetchTeams: IApiFetchTeamsParams = {
          teamIds: [rowMatch.idTeamHome, rowMatch.idTeamAway]
        }
        fetchTeams(paramsFetchTeams)
          .then(response => {
            response.data.forEach((team: ITeam) => {
              if ( team.id === rowMatch.idTeamHome) {
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
        
        // Fetch Match Lineups
        const paramsMatchLineups: IApiFetchMatchLineups = {
          matchId: rowMatch.id
        }
        fetchMatchLineups(paramsMatchLineups)
          .then(response => {
            const matchLineups: IMatchLineup[] = response.data;
            dispatch(addMatchPlayers(rowMatch, matchLineups));
            
          })
          .catch(error => {
            changeApiError(error);
          })
          .finally(() => {
            
          });
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [dispatch, idMatch]);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { isLoaded && (
        <AdminMatchHeader
          match={match}
          teamHome={teamHome}
          teamAway={teamAway}
        />
      ) }
      { isLoaded && (
        <Box p={3}>
          <Grid container direction="row" alignItems="flex-start" justifyContent="space-between" spacing={3}>
            <Grid item xs={12} sm={6} alignItems="center">
              <TeamMatchLineup 
                isAdmin={true}
                isHomeTeam={true}
                match={match}
                team={teamHome}
              />
            </Grid>
            <Grid item xs={12} sm={6} alignItems="center">
              <TeamMatchLineup 
                isAdmin={true}
                isHomeTeam={false}
                match={match}
                team={teamAway}
              />
            </Grid>
          </Grid>
        </Box>
      ) }
    </>
  )
}

export default MatchManager;