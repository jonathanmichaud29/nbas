import { Box, Card, CardContent, CardHeader, Container, Grid } from '@mui/material';
import CreatePlayer from '../Players/CreatePlayer';
import ListPlayers from '../Players/ListPlayers';
import { getStorageLeagueName } from '../utils/localStorage';

function PlayerManager() {
  const currentLeagueName = getStorageLeagueName();
  return (
    <>
      <Box p={3}>
        <Container maxWidth="sm">
          <Card>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <CardHeader title={`${currentLeagueName} Players`} component="h1"/>
              </Grid>
              <Grid item>
                <CardContent>
                  <CreatePlayer />
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      <Box p={3} pt={0}>
        <Card>
          <CardContent>
            <ListPlayers 
              isAdmin={true}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default PlayerManager;