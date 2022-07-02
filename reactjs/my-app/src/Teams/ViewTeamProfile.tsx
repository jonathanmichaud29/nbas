
import React, { useEffect, useState } from 'react';

import { Alert, Box, Card, CardContent, CircularProgress, Divider, Grid, Typography } from "@mui/material";

import { ITeamProfileProps, ITeam } from '../Interfaces/team'
import { IMatch, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'

import { fetchHistoryMatches, IApiFetchHistoryMatchesParams } from '../ApiCall/matches';

import StandingTeam from './StandingTeam'
import TeamMatchResume from './TeamMatchResume'
import YearStats from '../Stats/YearStats'


function ViewTeamProfile(props: ITeamProfileProps) {

  const { team } = props;

  const [apiError, changeApiError] = useState("");
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);
  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);

  const isLoaded = listMatches !== null && listMatchLineups !== null && listTeams !== null && listPlayers !== null;

  useEffect(() => {
    const paramsHistoryMatches: IApiFetchHistoryMatchesParams = {
      teamId: team.id
    }
    fetchHistoryMatches(paramsHistoryMatches)
      .then((response) => {
        setListPlayers(response.data.players);
        setListTeams(response.data.teams);
        setListMatches(response.data.matches);
        setListMatchLineups(response.data.matchLineups);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
  }, [team.id])

  return (
    <>
      <Card>
        <CardContent>
          { ! isLoaded && <Box><CircularProgress /></Box>}
          { apiError && <Alert severity="error">{apiError}</Alert> }
          <Grid container alignItems="center" justifyContent="center" flexDirection="column">
            <Grid item xs={12} style={{width:"100%"}}>
              <Typography variant="h3" component="h1" align="center">
                {team.name} Profile
              </Typography>
            </Grid>
            { isLoaded && (
              <>
                <Grid item xs={12} style={{width:"100%"}} p={3}>
                  <StandingTeam
                    key={`team-standing-${team.id}`}
                    team={team}
                    matches={listMatches}
                  />
                </Grid>
                <Grid item xs={12} style={{width:"100%"}} >
                  <YearStats
                    key={`team-year-stat-${team.id}`}
                    matchLineups={listMatchLineups}
                    players={listPlayers}
                    title={`${team.name} season batting stats`}
                  /> 
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      { isLoaded && listMatches && listMatches.length > 0 && (
        <Box pt={3}>
          <Card>
            <CardContent>
              <Typography component="h3" variant="h5" align="center">
                Team match history
              </Typography>
            </CardContent>
            <CardContent>
              <Grid container>
                <Grid item style={{width:'100%'}}>
                  { listMatches.map((match: IMatch) => {
                    const teamHome = listTeams.find((team) => team.id === match.idTeamHome)
                    const teamAway = listTeams.find((team) => team.id === match.idTeamAway)
                    const matchLineups = listMatchLineups.filter((lineup) => lineup.idMatch === match.id)
                    if( teamHome === undefined || teamAway === undefined || matchLineups === undefined ) return '';
                    return (
                      <React.Fragment key={`team-match-resume-${match.id}`}>
                        <Divider />
                        <TeamMatchResume
                          
                          team={team}
                          matchLineups={matchLineups}
                          match={match}
                          players={listPlayers}
                          teamHome={teamHome}
                          teamAway={teamAway}
                        />
                      </React.Fragment>
                    )
                  })}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  )
}

export default ViewTeamProfile;