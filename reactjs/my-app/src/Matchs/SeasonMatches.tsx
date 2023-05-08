import React, { useState, useEffect } from 'react';
import { batch } from 'react-redux';

import { Alert, Box, Card, CardActions, CardHeader, Grid, IconButton, Paper, Stack, Typography  } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

import { IMatch } from '../Interfaces/match';
import { ITeam } from '../Interfaces/team';
import { ILeagueSeason} from '../Interfaces/league';

import { fetchMatches, IApiFetchMatchesParams } from '../ApiCall/matches'

import LoaderInfo from '../Generic/LoaderInfo';

import { extractCalendarDay, extractHourFromDate } from '../utils/dateFormatter';
import { quickLinkMatch } from '../utils/constants';

interface ISeasonMatchesProps{
  leagueSeason: ILeagueSeason;
  listTeams: ITeam[];
}

function SeasonMatches(props: ISeasonMatchesProps) {

  const { leagueSeason, listTeams } = props;

  const [apiError, changeApiError] = useState("");
  const [listMatches, setListMatches] = useState<IMatch[]>([]);
  
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  listMatches.sort((a: IMatch,b: IMatch) => new Date(a.date).getTime() - new Date(b.date).getTime());

  useEffect(() => {
    let paramsFetchMatches: IApiFetchMatchesParams = {
      leagueSeasonIds:[leagueSeason.id]
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        batch(() => {
          setListMatches(response.data);
          setDataLoaded(true);
        });
      })
      .catch(error => {
        batch(() => {
          setDataLoaded(true);
          changeApiError(error);
        })
        
      })
      .finally(() => {
        
      });
      
  }, [leagueSeason.id]);
  
  let lastMatchCalendarDay = '';
  const htmlMatches = ( listMatches.length > 0 ? (
    <Box p={3} width="100%">
      <Grid container spacing={3} flexWrap="wrap"
        sx={{
          flexDirection:{xs:"column", sm:"row"}
        }}
      >
        { listMatches.map((match: IMatch) => {
          let listActions = [];
          
          const teamHome = listTeams.find((team: ITeam) => team.id === match.idTeamHome);
          const teamAway = listTeams.find((team: ITeam) => team.id === match.idTeamAway);
          const hourDate = extractHourFromDate(match.date);
          const currentMatchCalendarDay = extractCalendarDay(match.date);
          const isNewDay = currentMatchCalendarDay !== lastMatchCalendarDay;
          lastMatchCalendarDay = currentMatchCalendarDay;
          if( teamHome === undefined || teamAway === undefined) return "";

          let actionLabel;
          if( match.isCompleted ){
            actionLabel = `View Match ${match.id} - ${teamHome.name} VS ${teamAway.name}`;
            listActions.push(
              <IconButton color="primary"
                key={`action-view-match-${match.id}`}
                aria-label={actionLabel}
                title={actionLabel}
                href={`${quickLinkMatch.link}/${match.id}`}
                >
                <InfoIcon />
              </IconButton>
            );
          }
          
          return (
            <React.Fragment key={`match-row-${match.id}`}>
              { isNewDay && (
                <Grid item xs={12}>
                  <Typography variant="h4" component="h2">{lastMatchCalendarDay}</Typography>
                </Grid>
              )}
              <Grid item 
                xs={12} sm={6} md={3}
              >
                <Card raised={true}
                  sx={{
                    '&:hover' : {
                      backgroundColor:"#efefef"
                    }
                  }}
                >
                  <CardHeader 
                    title={`${teamHome.name} \nvs\n ${teamAway.name}`}
                    subheader={hourDate}
                    titleTypographyProps={{variant:'h6'}}
                    sx={{
                      flexDirection:'column-reverse',
                      textAlign:'center',
                      whiteSpace:'pre-line'
                    }}
                  />
                  <CardActions 
                    disableSpacing={true}
                    sx={{
                      justifyContent:'center',
                      flexWrap:'wrap'
                    }}
                  >
                    {listActions}
                  </CardActions>
                </Card>
              </Grid>
            </React.Fragment>
          )
        })}
      </Grid>
    </Box>
  ) : (
    <Alert severity='info'>No match found in this league</Alert>
  ));
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">Season Matches</Typography>
        <LoaderInfo
          isLoading={dataLoaded}
          msgError={apiError}
        />
        {htmlMatches}
      </Stack>

      
    </Paper>
  )
}
export default SeasonMatches;