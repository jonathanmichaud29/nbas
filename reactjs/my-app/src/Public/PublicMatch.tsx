import { useState, useMemo } from 'react';
import { useParams} from 'react-router-dom'

import { IMatch, IMatchEncounter, IMatchLineup } from "../Interfaces/match";

import { fetchMatches, fetchMatchLineups, IApiFetchMatchesParams, IApiFetchMatchLineups } from '../ApiCall/matches';

import ViewMatchDetails from '../Matchs/ViewMatchDetails';
import LoaderInfo from '../Generic/LoaderInfo';

import { castNumber } from '../utils/castValues';
import { ITeam, ITeamPlayers } from '../Interfaces/team';
import { batch } from 'react-redux';
import { IApiFetchPlayersParams, fetchPlayers } from '../ApiCall/players';
import { IApiFetchTeamsParams, fetchTeams } from '../ApiCall/teams';
import { IApiFetchTeamsPlayersParams, fetchTeamsPlayers } from '../ApiCall/teamsPlayers';
import { IPlayer, ITeamPlayer } from '../Interfaces/player';
import { addMatchPlayers } from '../redux/matchPlayerSlice';
import { addPlayers } from '../redux/playerSlice';
import { addTeamPlayers } from '../redux/teamPlayerSlice';
import { addTeams } from '../redux/teamSlice';


function PublicMatch() {
  let { id } = useParams();
  const idMatch = castNumber(id);

  // const [match, setMatch] = useState<IMatch | null>(null);
  const [matchEncounter, setMatchEncounter] = useState<IMatchEncounter>();
  const [apiError, changeApiError] = useState("");
  
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
          allPlayers:true,
          leagueIds:[matchData.idLeague]
        }
        const paramsFetchTeams: IApiFetchTeamsParams = {
          teamIds: listTeamIds,
          leagueIds:[matchData.idLeague]
        }
        const paramsMatchLineups: IApiFetchMatchLineups = {
          matchId: matchData.id
        }
        /* const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
          teamIds: listTeamIds,
        } */
        
        
        Promise.all([
          fetchPlayers(paramsFetchPlayers), 
          fetchTeams(paramsFetchTeams), 
          fetchMatchLineups(paramsMatchLineups),
          /* fetchTeamsPlayers(paramsFetchTeamsPlayers) */
        ]).then((values) => {
          const allPlayers: IPlayer[] = values[0].data;
          const teamsData: ITeam[] = values[1].data;
          const matchLineups: IMatchLineup[] = values[2].data;
          /* const teamsPlayers: ITeamPlayers[] = values[3].data;
          const allTeamPlayers: ITeamPlayer[] = teamsPlayers.map((tp) => {
            return {
              idPlayer: tp.playerId, 
              idTeam: tp.teamId, 
              idLeagueSeason: stateAdminContext.currentLeagueSeason?.id || 0
            }
          }) */
          
          batch(() => {
            
            /* dispatch(addPlayers(allPlayers)); */
            
            teamsData.forEach((team: ITeam) => {
              if ( team.id === matchData.idTeamHome) {
                teamHomeData = team;
              }
              else {
                teamAwayData = team
              }
            })
                        
            /* dispatch(addMatchPlayers(matchData, matchLineups));
            dispatch(addTeams(teamsData));
            dispatch(addTeamPlayers(allTeamPlayers)); */
            
            setMatchEncounter({
              match: matchData,
              teamHome: teamHomeData,
              teamAway: teamAwayData,
              players: allPlayers,
              matchLineups: matchLineups
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
  /**
   * Fetch Match details
   */
  useMemo( () => {
    fetchAllMatchDetails()
    /* const paramsFetchMatches: IApiFetchMatchesParams = {
      matchIds: [idMatch],
      isIgnoringLeague: true,
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        if( response.data[0] === undefined ){
          changeApiError("Something went wrong. Please contact the administrator")
        }
        else{
          setMatch(response.data[0])
        }
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      }); */
  }, [idMatch]);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { !!matchEncounter && (
        <ViewMatchDetails 
          matchEncounter={matchEncounter}
        />
      ) }
    </>
  )
}
export default PublicMatch;