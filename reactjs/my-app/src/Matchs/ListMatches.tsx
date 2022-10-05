import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Alert, Box, Grid, IconButton, Paper, Stack, Tooltip, Typography  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import { AppDispatch, RootState } from "../redux/store";
import { addMatches, removeMatch } from "../redux/matchSlice";
import { addTeams } from "../redux/teamSlice";
import { addLeagueTeams } from '../redux/leagueTeamSlice';

import { IMatch, IListMatchProps } from '../Interfaces/match';
import { ITeam } from '../Interfaces/team';

import { deleteMatch, fetchMatches, IApiDeleteMatchParams, IApiFetchMatchesParams } from '../ApiCall/matches'
import { fetchLeagueTeams, fetchTeams, IApiFetchLeagueTeamsParams, IApiFetchTeamsParams } from '../ApiCall/teams'

import ConfirmDelete from "../Modals/ConfirmDelete";
import LoaderInfo from '../Generic/LoaderInfo';
import InfoDialog from '../Generic/InfoDialog';

import { createHumanDate } from '../utils/dateFormatter';

function ListMatches(props: IListMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { league, isAdmin } = props;

  const listMatches = useSelector((state: RootState) => state.matches )
  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )

  
  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const clearMsgSuccess = () => {
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
        setTimeout(clearMsgSuccess, 1500);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {

      });
  }
  
  /**
   * Fetch League Teams
   */
  useMemo(() => {
    let paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      
    }
    if( league !== undefined ){
      paramsFetchLeagueTeams.leagueIds = [league.id]
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        dispatch(addLeagueTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [dispatch, league]);

  /**
   * Fetch Teams Details
   */
  useMemo(() => {
    const teamIds = listLeagueTeams.map((leagueTeam) => leagueTeam.idTeam);
    let paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: teamIds
    }
    if( league !== undefined ){
      paramsFetchTeams.leagueIds = [league.id]
    }

    fetchTeams(paramsFetchTeams)
      .then(response => {
        dispatch(addTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [dispatch, league, listLeagueTeams])

  /**
   * Fetch League Matches
   */
  useMemo(() => {
    let paramsFetchMatches: IApiFetchMatchesParams = {}
    if( league !== undefined ){
      paramsFetchMatches.leagueIds = [league.id]
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
  }, [dispatch, league])

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
  
  const orderedMatches = league !== undefined ? listMatches.filter((match) => match.idLeague === league.id) : [...listMatches];
  orderedMatches.sort((a: IMatch,b: IMatch) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const htmlMatches = ( orderedMatches.length > 0 ? orderedMatches.map((match: IMatch) => {
      let listActions = [];
      
      const teamHome = listTeams.find((team: ITeam) => team.id === match.idTeamHome);
      const teamAway = listTeams.find((team: ITeam) => team.id === match.idTeamAway);
      const dateReadable = createHumanDate(match.date);
      if( teamHome === undefined || teamAway === undefined) return "";

      let actionLabel;
      if( match.isCompleted ){
        actionLabel = `View Match ${match.id} - ${teamHome.name} VS ${teamAway.name}`;
        listActions.push(
          <IconButton color="primary"
            key={`action-view-match-${match.id}`}
            aria-label={actionLabel}
            title={actionLabel}
            href={`/match/${match.id}`}
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
          <Tooltip title={actionLabel} key={`action-delete-match-${match.id}`}>
            <IconButton color="primary"
              aria-label={actionLabel}
              /* title={actionLabel} */
              onClick={ () => handleOpenConfirmDelete(match) }
              >
              <Delete />
            </IconButton>
          </Tooltip>
        )
        
      }
      
      return (
        <Grid key={`match-row-${match.id}`} container columnSpacing={1} pt={1} pb={1} alignItems="center" flexWrap="nowrap" justifyContent="space-between"
          sx={{
            flexDirection:{xs:"column", sm:"row"},
            '&:hover':{
              backgroundColor:'#f1f1f1'
            }
          }}>
          <Grid item ><Typography variant="body1">{dateReadable}</Typography></Grid>
          <Grid item ><Typography variant="body1">{teamHome.name} VS {teamAway.name}</Typography></Grid>
          <Grid item >{ listActions.map((action) => action )}</Grid>
        </Grid>
      )
  }) : (
    <Alert severity='info'>No match found this season</Alert>
  ));
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">Season Matches</Typography>
        <LoaderInfo
          isLoading={isLoaded}
          /* msgSuccess={apiSuccess} */
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