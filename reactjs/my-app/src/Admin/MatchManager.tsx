import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { batch, useDispatch, useSelector } from 'react-redux';

import { Box, Grid } from '@mui/material';

import { AppDispatch, RootState } from '../redux/store';
import { addPlayers } from '../redux/playerSlice';
import { addMatchPlayers } from '../redux/matchPlayerSlice';

import { IMatch, IMatchEncounter, IMatchLineup } from "../Interfaces/match";
import { ITeam, ITeamPlayers } from '../Interfaces/team';

import { fetchMatches, fetchMatchLineups, 
  IApiFetchMatchesParams, IApiFetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchTeams, IApiFetchTeamsParams } from '../ApiCall/teams';


import AdminMatchHeader from '../Matchs/AdminMatchHeader';
import LoaderInfo from '../Generic/LoaderInfo';
import TeamMatchLineup from '../Teams/TeamMatchLineup';

import { castNumber } from '../utils/castValues';
import { IPlayer, ITeamPlayer } from '../Interfaces/player';
import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from '../ApiCall/teamsPlayers';
import { addTeamPlayers } from '../redux/teamPlayerSlice';

function MatchManager() {
  const dispatch = useDispatch<AppDispatch>();
  
  let { id } = useParams();
  const idMatch = castNumber(id);

  const [matchEncounter, setMatchEncounter] = useState<IMatchEncounter>();
  const [apiError, changeApiError] = useState("");

  const stateAdminContext = useSelector((state: RootState) => state.adminContext );
  
  const isLoaded = !!matchEncounter;
  
  const fetchAllMatchDetails = () => {
    let matchData: IMatch;
    let teamHomeData: ITeam;
    let teamAwayData: ITeam;
    const paramsFetchMatches: IApiFetchMatchesParams = {
      matchIds: [idMatch]
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        matchData = response.data[0];
        const listTeamIds = [matchData.idTeamHome, matchData.idTeamAway];
        const paramsFetchPlayers: IApiFetchPlayersParams = {
          allPlayers:true
        }
        const paramsFetchTeams: IApiFetchTeamsParams = {
          teamIds: listTeamIds
        }
        const paramsMatchLineups: IApiFetchMatchLineups = {
          matchId: matchData.id
        }
        const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
          teamIds: listTeamIds,
        }
        
        
        Promise.all([
          fetchPlayers(paramsFetchPlayers), 
          fetchTeams(paramsFetchTeams), 
          fetchMatchLineups(paramsMatchLineups),
          fetchTeamsPlayers(paramsFetchTeamsPlayers)
        ]).then((values) => {
          const allPlayers: IPlayer[] = values[0].data;
          const teamsData: ITeam[] = values[1].data;
          const matchLineups: IMatchLineup[] = values[2].data;
          const teamsPlayers: ITeamPlayers[] = values[3].data;
          const allTeamPlayers: ITeamPlayer[] = teamsPlayers.map((tp) => {
            return {
              idPlayer: tp.playerId, 
              idTeam: tp.teamId, 
              idLeagueSeason: stateAdminContext.currentLeagueSeason?.id || 0
            }
          })
          
          batch(() => {
            
            dispatch(addPlayers(allPlayers));
            
            teamsData.forEach((team: ITeam) => {
              if ( team.id === matchData.idTeamHome) {
                teamHomeData = team;
              }
              else {
                teamAwayData = team
              }
            })
                        
            dispatch(addMatchPlayers(matchData, matchLineups));
            dispatch(addTeamPlayers(allTeamPlayers));
            
            setMatchEncounter({
              match: matchData,
              teamHome: teamHomeData,
              teamAway: teamAwayData,
            })
          })
        });
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }

  useEffect(()=>{
    if( stateAdminContext.currentLeagueSeason === null ) return;
    fetchAllMatchDetails()
  },[stateAdminContext.currentLeagueSeason])

  return (
    <>
      <LoaderInfo
        isLoading={!!matchEncounter}
        msgError={apiError}
        hasWrapper={true}
      />
      { isLoaded && (
        <AdminMatchHeader
          match={matchEncounter.match}
          teamHome={matchEncounter.teamHome}
          teamAway={matchEncounter.teamAway}
        />
      ) }
      { isLoaded && (
        <Box p={3}>
          <Grid container direction="row" alignItems="flex-start" justifyContent="space-between" spacing={3}>
            <Grid item xs={12} sm={6} alignItems="center">
              <TeamMatchLineup 
                isAdmin={true}
                isHomeTeam={true}
                match={matchEncounter.match}
                team={matchEncounter.teamHome}
              />
            </Grid>
            <Grid item xs={12} sm={6} alignItems="center">
              <TeamMatchLineup 
                isAdmin={true}
                isHomeTeam={false}
                match={matchEncounter.match}
                team={matchEncounter.teamAway}
              />
            </Grid>
          </Grid>
        </Box>
      ) }
    </>
  )
}

export default MatchManager;