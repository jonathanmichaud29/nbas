import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Alert, Box, CircularProgress, IconButton, List, ListItem  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';

import { IMatch, IMatchProps } from '../Interfaces/Match';
import { ITeam } from '../Interfaces/Team';

import { addMatches, removeMatch } from "../redux/matchSlice";
import { addTeams } from "../redux/teamSlice";
import { deleteMatch, fetchMatches } from '../ApiCall/matches'
import { fetchTeams } from '../ApiCall/teams'

import ConfirmDelete from "../Modals/ConfirmDelete";
import { Link } from 'react-router-dom';

function ListMatches(props: IMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { is_admin } = props;

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
    fetchTeams()
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
  const [currentMatchView, setCurrentMatchView] = useState<IMatch>();
  const [isModalOpenConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleOpenConfirmDelete = (match: IMatch) => {
    setCurrentMatchView(match);
    setOpenConfirmDelete(true);
  }
  
  const cbCloseConfirmDelete = (match?: IMatch) => {
    if( match ) {
      confirmDeleteMatch(match);
    }
    setOpenConfirmDelete(false);
  }

  const htmlMatches = ( listMatches.length > 0 ? (
    <List>
      {listMatches.map((match: IMatch) => {
        let listActions = [];
        if( is_admin ) {
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
        const teamHome = listTeams.find((team: ITeam) => team.id === match.id_team_home);
        const teamAway = listTeams.find((team: ITeam) => team.id === match.id_team_away);
        const dateObject = new Date(match.date)
        const dateHuman = dateObject.toLocaleDateString("en-CA",{ 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hourCycle:'h24', 
          hour: '2-digit', 
          minute: '2-digit', 
          timeZone: 'UTC' 
        });
        return (
          <ListItem 
            key={`match-${match.id}`}
            secondaryAction={ listActions.map((action) => action) }
            >{teamHome?.name} VS {teamAway?.name} {dateHuman}</ListItem>
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
      {/* { is_admin && (
        <ConfirmDelete
          is_open={isModalOpenConfirmDelete}
          callback_close_modal={cbCloseConfirmDelete}
          selected_match={currentMatchView}
          context="match"
          />
      )} */}
    </div>
  )
}
export default ListMatches;