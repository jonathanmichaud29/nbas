import { useSelector } from "react-redux"

import { Box, Button, Card, CardActions, CardHeader, Grid, Link, Paper, Stack, Typography } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';

import { RootState } from "../redux/store"

import PublicMenu from "../Menu/PublicMenu";

export default function SelectLeague() {

  const statePublicContext = useSelector((state: RootState) => state.publicContext )
  
  const listLeagues = statePublicContext.leagues
  const listLeagueSeasons = statePublicContext.leagueSeasons

  return (
    <>
      <PublicMenu />
      <Paper component={Box} m={3} p={3}>
        <Stack spacing={3} alignItems="center" pb={6}>
          <Typography variant="h1">Choose a league season to view</Typography>
          <Typography variant="body1">Message de bienvenue</Typography>
        </Stack>
        <Grid container
          flexWrap="wrap"
          spacing={5}
          sx={{
            flexDirection:{xs:"column", sm:"row"},
          }}
        >
          {listLeagues.map((league) => {
            const myLeagueSeasons = listLeagueSeasons.filter((leagueSeason) => leagueSeason.idLeague === league.id)
            return (
              <Grid item 
                key={`league-${league.id}`}
                xs={12} sm={6}
              >
                <Card raised={true}>
                  <CardHeader 
                    title={league.name}
                    titleTypographyProps={{variant:'h2'}}
                  />
                  <CardActions 
                    sx={{
                      justifyContent:'center',
                      display:'flex',
                      flexDirection:'column'
                    }}
                  >
                    <Stack spacing={1} pb={3}>
                      {myLeagueSeasons.map((leagueSeason) => 
                        <Button 
                          key={`action-access-season-${leagueSeason.id}`}
                          variant="contained"
                          endIcon={<SendIcon />}
                          LinkComponent={Link}
                          href={`/${leagueSeason.id}`}
                        >{leagueSeason.name}</Button>
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
        
      </Paper>
    </>
  )
}