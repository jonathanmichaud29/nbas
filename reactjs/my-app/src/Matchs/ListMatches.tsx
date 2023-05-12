import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Alert, Box, Card, CardActions, CardHeader, Grid, IconButton, Paper, Stack, Typography  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import { AppDispatch, RootState } from "../redux/store";
import { addMatches, removeMatch } from "../redux/matchSlice";

import { IMatch, IListMatchProps } from '../Interfaces/match';
import { ITeam } from '../Interfaces/team';

import { deleteMatch, fetchMatches, IApiDeleteMatchParams, IApiFetchMatchesParams } from '../ApiCall/matches'

import ConfirmDelete from "../Modals/ConfirmDelete";
import LoaderInfo from '../Generic/LoaderInfo';
import InfoDialog from '../Generic/InfoDialog';

import { createHumanDate, extractCalendarDay, extractHourFromDate } from '../utils/dateFormatter';
import { filterMatchesBySeason } from '../utils/dataFilter';
import { quickLinkMatch } from '../utils/constants';

function ListMatches(props: IListMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { isAdmin } = props;

  const stateAdminContext = useSelector((state: RootState) => state.adminContext );
  const listMatches = useSelector((state: RootState) => state.matches )
  const listTeams = useSelector((state: RootState) => state.teams )

  const filteredMatches = filterMatchesBySeason(stateAdminContext.currentLeagueSeason, listMatches)
    .sort((a: IMatch,b: IMatch) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeleteMatch = (match: IMatch) => {
    reinitializeApiMessages()

    const paramsDeleteMatch: IApiDeleteMatchParams = {
      matchId: match.id
    }
    deleteMatch(paramsDeleteMatch)
      .then(response => {
        dispatch(removeMatch(match.id));
        changeApiSuccess(response.message);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {

      });
  }

  useEffect(() => {
    let paramsFetchMatches: IApiFetchMatchesParams = {
      isAdminContext:isAdmin
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        dispatch(addMatches(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }, [dispatch, isAdmin, stateAdminContext.currentLeague]);
  
  /**
   * Handle multiples modals
   */
  const [currentMatchView, setCurrentMatchView] = useState<IMatch | null>(null);
  const [isModalOpenConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [teamHome, setTeamHome] = useState<ITeam | null>(null);
  const [teamAway, setTeamAway] = useState<ITeam | null>(null);
  const [dateMatchReadable, setDateMatchReadable] = useState<string | null>(null);

  const handleOpenConfirmDelete = (match: IMatch) => {
    const newTeamHome = listTeams.find((team) => team.id === match.idTeamHome);
    const newTeamAway = listTeams.find((team) => team.id === match.idTeamAway);
    if( newTeamHome === undefined || newTeamAway === undefined ) {
      return;
    }
    setDateMatchReadable(createHumanDate(match.date));
    setTeamHome(newTeamHome);
    setTeamAway(newTeamAway);
    setCurrentMatchView(match);
    setOpenConfirmDelete(true);
  }
  
  const cbCloseModalDelete = () => {
    setOpenConfirmDelete(false);
  }
  const cbCloseConfirmDelete = () => {
    if( currentMatchView ){
      confirmDeleteMatch(currentMatchView);
      setCurrentMatchView(null);
    }
    setOpenConfirmDelete(false);
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
          if( isAdmin ) {
            actionLabel=`Edit Match ${match.id} - ${teamHome.name} VS ${teamAway.name}`;
            listActions.push(
              <IconButton color="primary"
                key={`action-edit-match-${match.id}`}
                aria-label={actionLabel}
                title={actionLabel}
                href={`/admin/match/${match.id}`}
                >
                <EditIcon />
              </IconButton>
            )
            
            actionLabel=`Delete Match ${match.id} - ${teamHome.name} VS ${teamAway.name}`
            listActions.push(
              <IconButton color="primary"
                key={`action-delete-match-${match.id}`}
                aria-label={actionLabel}
                title={actionLabel}
                onClick={ () => handleOpenConfirmDelete(match) }
                >
                <Delete />
              </IconButton>
            )
            
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
          isLoading={isLoaded}
          msgError={apiError}
        />
        { apiSuccess && (
          <InfoDialog
            msgSuccess={apiSuccess}
          />
        )}
        {htmlMatches}
      </Stack>

      { isAdmin && currentMatchView && teamHome && teamAway && (
        <ConfirmDelete
          isOpen={isModalOpenConfirmDelete}
          callbackCloseModal={cbCloseModalDelete}
          callbackConfirmDelete={cbCloseConfirmDelete}
          title={`Delete Match`}
          description={`Are-you sure you want to delete the match '${teamHome.name}' VS '${teamAway.name}', happening on day '${dateMatchReadable}'?`}
          />
      ) }
    </Paper>
  )
}
export default ListMatches;