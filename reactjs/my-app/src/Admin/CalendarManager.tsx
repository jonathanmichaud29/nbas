import { Box, Container, Card, Grid, CardHeader, CardContent } from '@mui/material';
import CreateMatch from '../Matchs/CreateMatch';
import ListMatches from '../Matchs/ListMatches';
import { getStorageLeagueName } from '../utils/localStorage';

function CalendarManager() {
  const currentLeagueName = getStorageLeagueName();
  return (
    <>
      <Box p={3}>
        <Container maxWidth="sm">
          <Card>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <CardHeader title={`${currentLeagueName} Calendar`} component="h1"/>
              </Grid>
              <Grid item>
                <CardContent>
                  <CreateMatch />
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      <Box p={3} pt={0}>
        <Card>
          <CardContent>
            <ListMatches 
              isAdmin={true}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default CalendarManager;