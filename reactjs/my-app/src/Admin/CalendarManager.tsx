import { useState, useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';

import { ILeagueTeam } from '../Interfaces/league';

import { AppDispatch, RootState } from '../redux/store';
import { addLeagueTeams } from '../redux/leagueTeamSlice';
import { addTeamSeasons } from '../redux/teamSeasonSlice';
import { addTeams } from '../redux/teamSlice';

import { IApiFetchLeagueTeamsParams, fetchLeagueTeams, 
  IApiFetchTeamsParams, IApiFetchTeamSeasonsParams, 
  fetchTeams, fetchTeamSeasons } from '../ApiCall/teams';

import CreateMatch from '../Matchs/CreateMatch';
import ListMatches from '../Matchs/ListMatches';
import LoaderInfo from '../Generic/LoaderInfo';


function CalendarManager() {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState<string>("");

  const stateAdminContext = useSelector((state: RootState) => state.adminContext );
  
  const fetchAllLeagueSeasonTeams = () => {
    
  }
  
  useEffect(() => {
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        const listLeagueTeams: ILeagueTeam[] = response.data || [];

        const teamIds = listLeagueTeams.map((leagueTeam) => leagueTeam.idTeam);

        const paramsFetchTeams: IApiFetchTeamsParams = {
          teamIds: teamIds
        }
        const paramsFetchTeamSeasons: IApiFetchTeamSeasonsParams = {
          teamIds: teamIds
        }
        Promise.all([fetchTeams(paramsFetchTeams), fetchTeamSeasons(paramsFetchTeamSeasons)]).then((values) => {
          batch(() => {
            dispatch(addLeagueTeams(listLeagueTeams));
            dispatch(addTeams(values[0].data));
            dispatch(addTeamSeasons(values[1].data));
          })
        });
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [dispatch, stateAdminContext.currentLeague]);

  return (
    <>
      <LoaderInfo
        hasWrapper={true}
        msgError={apiError}
        
      />
      <CreateMatch />
      
      <ListMatches 
        isAdmin={true}
      />
    </>
  )
}

export default CalendarManager;