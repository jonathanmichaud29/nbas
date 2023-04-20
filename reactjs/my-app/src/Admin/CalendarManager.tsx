import { useDispatch, useSelector } from 'react-redux';
import CreateMatch from '../Matchs/CreateMatch';
import ListMatches from '../Matchs/ListMatches';
import { useState, useEffect } from 'react';
import { IApiFetchLeagueTeamsParams, fetchLeagueTeams, IApiFetchTeamsParams, IApiFetchTeamSeasonsParams, fetchTeams, fetchTeamSeasons } from '../ApiCall/teams';
import { ILeagueTeam } from '../Interfaces/league';
import { addLeagueTeams } from '../redux/leagueTeamSlice';
import { AppDispatch, RootState } from '../redux/store';
import { addTeamSeasons } from '../redux/teamSeasonSlice';
import { addTeams } from '../redux/teamSlice';
import LoaderInfo from '../Generic/LoaderInfo';
import { batch } from 'react-redux';

function CalendarManager() {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState<string>("");

  const stateAdminContext = useSelector((state: RootState) => state.adminContext );
  
  const fetchAllLeagueSeasonTeams = () => {
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        const listLeagueTeams: ILeagueTeam[] = response.data || [];
        // dispatch(addLeagueTeams(listLeagueTeams));

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
  }
  
  useEffect(() => {
    fetchAllLeagueSeasonTeams();
  }, [stateAdminContext.currentLeague]);

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