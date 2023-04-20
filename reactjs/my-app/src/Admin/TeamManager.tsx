import { useEffect, useState } from 'react';
import { Paper, Box, Grid } from '@mui/material';
import { batch, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../redux/store';
import { addLeagueTeams } from '../redux/leagueTeamSlice';
import { addTeams } from '../redux/teamSlice';
import { addTeamSeasons } from '../redux/teamSeasonSlice';

import { ILeagueTeam } from '../Interfaces/league';

import { IApiFetchLeagueTeamsParams, fetchLeagueTeams, 
  IApiFetchTeamsParams, fetchTeams, 
  IApiFetchTeamSeasonsParams, fetchTeamSeasons } from '../ApiCall/teams';

import AddTeamSeason from '../Teams/AddTeamSeason';
import CreateTeam from '../Teams/CreateTeam';
import ListTeams from '../Teams/ListTeams';
import LoaderInfo from '../Generic/LoaderInfo';


function TeamManager() {
  const dispatch = useDispatch<AppDispatch>();
  
  const [apiError, changeApiError] = useState<string>("");

  const stateAdminContext = useSelector((state: RootState) => state.adminContext );
  
  const fetchAllLeagueSeasonTeams = () => {
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
      { stateAdminContext.currentLeague ? (
        <Paper component={Box} p={3} m={3}>
          <Box p={3} width="100%">
            <Grid container spacing={3} flexWrap="wrap"
              sx={{
                flexDirection:{xs:"column", sm:"row"}
              }}
            >
              <Grid item 
                key={`create-team`} 
                xs={12} sm={6}
              >
                <CreateTeam />
              </Grid>
              <Grid item 
                key={`reuse-team`} 
                xs={12} sm={6}
              >
                <AddTeamSeason />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      ) : '' }

      { stateAdminContext.currentLeague ? (
        <ListTeams 
          isAdmin={true}
          isAddPlayers={true}
          isViewPlayers={true}
          leagueSeason={stateAdminContext.currentLeagueSeason}
        />
      ) : '' }
    </>
  )
}

export default TeamManager;