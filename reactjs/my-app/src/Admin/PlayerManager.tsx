import { Box, Card, CardContent, CardHeader, Container, Grid } from '@mui/material';
import CreatePlayer from '../Players/CreatePlayer';
import ListPlayers from '../Players/ListPlayers';

function PlayerManager() {

  return (
    <>
      <Box p={3}>
        <Container maxWidth="sm">
          <Card>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <CardHeader title={`${window.localStorage.getItem("currentLeagueName")} Players`} component="h1"/>
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