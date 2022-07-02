
import React, { useEffect, useState } from 'react';

import { Alert, Box, Card, CardContent, CircularProgress, Divider, Grid, Typography } from "@mui/material";

import { fetchHistoryMatches, IApiFetchHistoryMatchesParams } from '../ApiCall/matches';

import { IPlayerProfileProps } from '../Interfaces/player'
import { IMatch, IMatchLineup } from '../Interfaces/match'
import { ITeam } from '../Interfaces/team'

import PlayerMatchResume from './PlayerMatchResume'
import YearStats from '../Stats/YearStats';
import ProgressionStats from '../Stats/ProgressionStats';


function ViewPlayerProfile(props: IPlayerProfileProps) {

  const { player } = props;

  const [apiError, changeApiError] = useState("");
  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);

  const isLoaded = listMatches !== null && listMatchLineups !== null && listTeams !== null;

  useEffect(() => {
    const paramsHistoryMatches: IApiFetchHistoryMatchesParams = {
      playerId: player.id
    }
    fetchHistoryMatches(paramsHistoryMatches)
      .then((response) => {
        setListTeams(response.data.teams);
        const allMatches: IMatch[] = response.data.matches.map((match: IMatch) => match);
        allMatches.sort((a,b) => a.date < b.date ? -1 : 1);
        setListMatches(allMatches);
        setListMatchLineups(response.data.matchLineups);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
  }, [player.id])

  return (
    <>
      <Card>
        <CardContent>
          { ! isLoaded && <Box><CircularProgress /></Box>}
          { apiError && <Alert severity="error">{apiError}</Alert> }
          <Grid container alignItems="center" justifyContent="center" flexDirection="column">
            <Grid item xs={12} style={{width:"100%"}}>
              <Typography variant="h3" component="h1" align='center'>
                {player.name} Profile
              </Typography>
            </Grid>
        
            { isLoaded && (
              <>
                <Grid item xs={12} style={{width:"100%"}} >
                  <YearStats
                    key={`player-year-stat-${player.id}`}
                    matchLineups={listMatchLineups}
                    players={[player]}
                    title={`${player.name} season batting stats`}
                  /> 
                </Grid>
                <Grid item xs={12} style={{width:"100%"}} >
                  <ProgressionStats
                    key={`progression-player-stat-${player.id}`}
                    matches={listMatches}
                    matchLineups={listMatchLineups}
                  />
                </Grid>
                <Divider />
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
                Player match history
              </Typography>
            </CardContent>
            <CardContent>
              <Grid container>
                <Grid item style={{width:'100%'}}>
                  { listMatches.map((match: IMatch) => {
                    const teamHome = listTeams.find((team) => team.id === match.idTeamHome)
                    const teamAway = listTeams.find((team) => team.id === match.idTeamAway)
                    const playerLineup = listMatchLineups.find((lineup) => lineup.idMatch === match.id)
                    if( teamHome === undefined || teamAway === undefined || playerLineup === undefined ) return '';
                    return (
                      <React.Fragment key={`player-match-resume-${match.id}`}>
                        <Divider />
                        <PlayerMatchResume
                          
                          playerLineup={playerLineup}
                          match={match}
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

export default ViewPlayerProfile;