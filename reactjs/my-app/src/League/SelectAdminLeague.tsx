import { useSelector } from "react-redux"

import { Box, Button, Card, CardActions, CardHeader, Grid, Link, Paper, Stack, Typography } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';

import { RootState } from "../redux/store"

import { quickLinkAdminLeague } from "../utils/constants";
import { ILeagueSeason } from "../Interfaces/league";
import { replaceSeasonLink } from "../utils/linksGenerator";

export default function SelectAdminLeague() {

  const stateAdminContext = useSelector((state: RootState) => state.adminContext )

  const listLeagues = stateAdminContext.leagues
  const listLeagueSeasons = stateAdminContext.leagueSeasons

  return (
    <>
      <Paper component={Box} m={3} p={3}>
        <Stack spacing={3} alignItems="center" pb={6}>
          <Typography variant="h1">Choose a league season to manage</Typography>
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
              .sort((a,b) => b.year - a.year)
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
                      {myLeagueSeasons.map((leagueSeason) => {
                        const link = replaceSeasonLink(quickLinkAdminLeague.link, leagueSeason.id.toString());
                        // const link = quickLinkAdminLeague.link.replace(':idSeason', leagueSeason.id.toString())
                        return (
                          <Button 
                            key={`action-access-season-${leagueSeason.id}`}
                            variant="contained"
                            endIcon={<SendIcon />}
                            LinkComponent={Link}
                            href={link}
                          >{leagueSeason.year} - {leagueSeason.name}</Button>
                        )}
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
