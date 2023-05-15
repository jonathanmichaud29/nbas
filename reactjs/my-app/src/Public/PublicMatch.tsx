import { useState, useMemo } from 'react';
import { useParams} from 'react-router-dom'
import { batch } from 'react-redux';

import { Alert } from '@mui/material';

import { IMatch, IMatchEncounter, IMatchLineup } from "../Interfaces/match";
import { IPlayer } from '../Interfaces/player';
import { ITeam } from '../Interfaces/team';

import { fetchMatches, fetchMatchLineups, IApiFetchMatchesParams, IApiFetchMatchLineups } from '../ApiCall/matches';
import { IApiFetchPlayersParams, fetchPlayers } from '../ApiCall/players';
import { IApiFetchTeamsParams, fetchTeams } from '../ApiCall/teams';

import ViewMatchDetails from '../Matchs/ViewMatchDetails';
import LoaderInfo from '../Generic/LoaderInfo';

import { castNumber } from '../utils/castValues';

function PublicMatch() {
  let { id } = useParams();
  const idMatch = castNumber(id);

  const [matchEncounter, setMatchEncounter] = useState<IMatchEncounter | null>(null);
  const [apiError, changeApiError] = useState("");
  
  const isLoaded = !!matchEncounter;

  
  /**
   * Fetch Match details
   */
  useMemo( () => {
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
          
          
          Promise.all([
            fetchPlayers(paramsFetchPlayers), 
            fetchTeams(paramsFetchTeams), 
            fetchMatchLineups(paramsMatchLineups),
          ]).then((values) => {
            const allPlayers: IPlayer[] = values[0].data;
            const teamsData: ITeam[] = values[1].data;
            const matchLineups: IMatchLineup[] = values[2].data;
            
  
            batch(() => {
              
              teamsData.forEach((team: ITeam) => {
                if ( team.id === matchData.idTeamHome) {
                  teamHomeData = team;
                }
                else {
                  teamAwayData = team
                }
              })
  
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
    fetchAllMatchDetails()
  }, [idMatch]);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { matchEncounter !== null ? (
        <ViewMatchDetails 
          matchEncounter={matchEncounter}
        />
      ) : (
        <Alert severity='info'>There is no match details</Alert>
      ) }
    </>
  )
}
export default PublicMatch;