import React, { useState, useEffect } from 'react';
import { batch } from 'react-redux';

import { Accordion, AccordionDetails, AccordionSummary, 
  Card, CardActions, CardHeader, Grid,
  Alert, Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { usePublicContext } from '../Public/PublicApp';

import { IMatch, IMatchTimeline } from '../Interfaces/match';
import { ITeam } from '../Interfaces/team';

import { fetchMatches, IApiFetchMatchesParams } from '../ApiCall/matches'

import LoaderInfo from '../Generic/LoaderInfo';
import FilterTeams from '../Teams/FilterTeams';
import FilterTimelineMatches from './FilterTimelineMatches';

import { extractCalendarDay, extractHourFromDate } from '../utils/dateFormatter';
import { listMatchTimeline, quickLinkMatch } from '../utils/constants';
import { sxGroupStyles } from '../utils/theme';

interface ISeasonMatchesProps{
  
}

function SeasonMatches(props: ISeasonMatchesProps) {

  const { leagueSeason, leagueSeasonTeams } = usePublicContext();

  const [apiError, changeApiError] = useState("");
  const [listMatches, setListMatches] = useState<IMatch[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<ITeam[]>(leagueSeasonTeams);
  const [matchTimeline, setMatchTimeline] = useState<IMatchTimeline>(listMatchTimeline[0]);
  
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const baseLinkMatchDetails = `${quickLinkMatch.link}/`.replace(':idSeason', leagueSeason.id.toString())
  
  const tomorrow = new Date();
  const lowerDate = new Date().setHours(0,0,0,0);
  const upperDate = new Date(tomorrow.setDate(tomorrow.getDate()+1)).setHours(0,0,0,0);

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
  
  const listSelectedTeamIds = selectedTeams.map((team) => team.id);
  let filteredMatches = listMatches.filter((match) => listSelectedTeamIds.includes(match.idTeamAway) || listSelectedTeamIds.includes(match.idTeamHome))
  if( matchTimeline.key === 'past') {
    filteredMatches = filteredMatches.filter((match) => new Date(match.date).getTime() < upperDate)
  } else if( matchTimeline.key === 'upcoming') {
    filteredMatches = filteredMatches.filter((match) => new Date(match.date).getTime() > lowerDate)
  }


  let lastMatchCalendarDay = '';
  const htmlMatches = ( filteredMatches.length > 0 ? (
    <Box p={3} width="100%">
      <Grid container spacing={3} flexWrap="wrap"
        sx={{
          flexDirection:{xs:"column", sm:"row"}
        }}
      >
        { filteredMatches.map((match: IMatch) => {
          let listActions = [];
          
          const teamHome = leagueSeasonTeams.find((team: ITeam) => team.id === match.idTeamHome) || null;
          const teamAway = leagueSeasonTeams.find((team: ITeam) => team.id === match.idTeamAway) || null;
          const hourDate = extractHourFromDate(match.date);
          const currentMatchCalendarDay = extractCalendarDay(match.date);
          const isNewDay = currentMatchCalendarDay !== lastMatchCalendarDay;
          lastMatchCalendarDay = currentMatchCalendarDay;
          if( teamHome === null || teamAway === null ) return "";

          let actionLabel;
          if( match.isCompleted ){
            actionLabel = `View Match ${match.id} - ${teamHome.name} VS ${teamAway.name}`;
            listActions.push(
              <IconButton color="primary"
                key={`action-view-match-${match.id}`}
                aria-label={actionLabel}
                title={actionLabel}
                href={`${baseLinkMatchDetails}${match.id}`}
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
                    title={`${teamHome.name} \nreceives\n ${teamAway.name}`}
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

  const updateFilteredTeams = (activeFilter: boolean, teams: ITeam[]) => {
    
    if( activeFilter ) {
      setSelectedTeams(teams);
    }
    else{
      setSelectedTeams(leagueSeasonTeams);
    }
    
  }

  const updateSelectTimeline = (matchTimeline: IMatchTimeline) => {
    setMatchTimeline(matchTimeline);
  }

  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">Season Matches</Typography>
        <LoaderInfo
          isLoading={dataLoaded}
          msgError={apiError}
        />

        <Accordion
          sx={{
            width:'100%'
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="toggle-filter-matches"
            sx={sxGroupStyles.accordionSummary}
          >
            <Typography variant="h6">Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FilterTeams 
              teams={leagueSeasonTeams}
              cbSelectTeams={updateFilteredTeams}
            />

            <FilterTimelineMatches 
              cbSelectTimeline={updateSelectTimeline}
            /> 
          </AccordionDetails>
        </Accordion>

        {htmlMatches}
      </Stack>
    </Paper>
  )
}
export default SeasonMatches;