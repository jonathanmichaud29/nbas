import { Paper, Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import CreateTeam from '../Teams/CreateTeam';
import ListTeams from '../Teams/ListTeams';

function TeamManager() {
  
  const stateAdminContext = useSelector((state: RootState) => state.adminContext );

  return (
    <>
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
        />
      ) : '' }
    </>
  )
}

export default TeamManager;