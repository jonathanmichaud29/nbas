import { Box, Container, Card, Grid, CardHeader, CardContent } from '@mui/material';
import CreateTeam from '../Teams/CreateTeam';
import ListTeams from '../Teams/ListTeams';
import { getStorageLeagueName } from '../utils/localStorage';

function TeamManager() {
  const currentLeagueName = getStorageLeagueName();
  return (
    <>
      <Box p={3}>
        <Container maxWidth="sm">
          <Card>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <CardHeader title={`${currentLeagueName} Teams`} component="h1"/>
              </Grid>
              <Grid item>
                <CardContent>
                  <CreateTeam />
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      <Box p={3} pt={0}>
        <Card>
          <CardContent>
            <ListTeams 
              isAdmin={true}
              isAddPlayers={true}
              isViewPlayers={true}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default TeamManager;