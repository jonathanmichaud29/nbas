import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Alert, Box, CircularProgress, IconButton, List, ListItem  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import { IMatch, IListMatchProps } from '../Interfaces/match';
import { ITeam } from '../Interfaces/team';

import { addMatches, removeMatch } from "../redux/matchSlice";
import { addTeams } from "../redux/teamSlice";
import { deleteMatch, fetchMatches } from '../ApiCall/matches'
import { fetchTeams, IApiFetchTeamsParams } from '../ApiCall/teams'

import ConfirmDelete from "../Modals/ConfirmDelete";
import { createDateReadable } from '../utils/dateFormatter';

function ListMatches(props: IListMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { isAdmin } = props;

  const listMatches = useSelector((state: RootState) => state ).matches
  const listTeams = useSelector((state: RootState) => state ).teams

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeleteMatch = (match: IMatch) => {
    reinitializeApiMessages()
    deleteMatch(match.id)
      .then(response => {
        dispatch(removeMatch(match.id));
        changeApiSuccess(response.message)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {

      });
  }
  
  useEffect(() => {
    
    const paramsFetchTeams: IApiFetchTeamsParams = {
      allTeams: true
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        dispatch(addTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
    fetchMatches()
      .then(response => {
        dispatch(addMatches(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }, [dispatch])

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
    setDateMatchReadable(createDateReadable(match.date));
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

  const htmlMatches = ( listMatches.length > 0 ? (
    <List>
      {listMatches.map((match: IMatch) => {
        let listActions = [];
        listActions.push(
          <IconButton 
            key={`action-view-match-${match.id}`}
            aria-label={`View Match ${match.id}`}
            title={`View Match ${match.id}`}
            >
            <Link to={`/match/${match.id}`}>
              <InfoIcon />
            </Link>
          </IconButton>
        );
        if( isAdmin ) {
          listActions.push(
            <IconButton 
              key={`action-edit-match-${match.id}`}
              aria-label={`Edit Match ${match.id}`}
              title={`Edit Match ${match.id}`}
              >
              <Link to={`/admin/match/${match.id}`}>
                <EditIcon />
              </Link>
            </IconButton>
          )

          listActions.push(
            <IconButton 
              key={`action-delete-match-${match.id}`}
              aria-label={`Delete Match ${match.id}`}
              title={`Delete Match ${match.id}`}
              onClick={ () => handleOpenConfirmDelete(match) }
              >
              <Delete />
            </IconButton>
          )
          
        }
        const teamHome = listTeams.find((team: ITeam) => team.id === match.idTeamHome);
        const teamAway = listTeams.find((team: ITeam) => team.id === match.idTeamAway);
        const dateReadable = createDateReadable(match.date);
        return (
          <ListItem 
            key={`match-${match.id}`}
            secondaryAction={ listActions.map((action) => action) }
            >{teamHome?.name} VS {teamAway?.name} {dateReadable}</ListItem>
        )
      })}
      
    </List>
  ) : '' );
  
  return (
    <div className="public-layout">
      <h2>Calendar</h2>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { apiSuccess && <Alert severity="success">{apiSuccess}</Alert> }
      { htmlMatches }
      { isAdmin && currentMatchView && teamHome && teamAway && (
        <ConfirmDelete
          isOpen={isModalOpenConfirmDelete}
          callbackCloseModal={cbCloseModalDelete}
          callbackConfirmDelete={cbCloseConfirmDelete}
          title={`Confirm match deletion`}
          description={`Are-you sure you want to delete the match '${teamHome.name}' VS '${teamAway.name}', happening on day '${dateMatchReadable}'?`}
          />
      ) }
    </div>
  )
}
export default ListMatches;