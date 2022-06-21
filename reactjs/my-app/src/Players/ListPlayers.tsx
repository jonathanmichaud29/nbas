import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addPlayers, removePlayer } from "../redux/playerSlice";

import { Alert, Box, CircularProgress, IconButton, List, ListItem  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { deletePlayer, fetchPlayers } from '../ApiCall/players'
import { IPlayer, IPlayerProps } from '../Interfaces/player';

import ConfirmDelete from "../Modals/ConfirmDelete";

function ListPlayers(props: IPlayerProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { isAdmin } = props;

  const listPlayers = useSelector((state: RootState) => state.players )

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeletePlayer = (player: IPlayer) => {
    reinitializeApiMessages()
    deletePlayer(player.id)
      .then(response => {
        dispatch(removePlayer(player.id));
        changeApiSuccess(response.message)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {

      });
  }
  
  useEffect(() => {
    fetchPlayers()
      .then(response => {
        dispatch(addPlayers(response.data));
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
  const [currentPlayerView, setCurrentPlayerView] = useState<IPlayer | null>(null);
  const [isModalOpenConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleOpenConfirmDelete = (player: IPlayer) => {
    setCurrentPlayerView(player);
    setOpenConfirmDelete(true);
  }
  
  const cbCloseModalDelete = () => {
    setOpenConfirmDelete(false);
  }
  const cbCloseConfirmDelete = () => {
    if( currentPlayerView ){
      confirmDeletePlayer(currentPlayerView);
      setCurrentPlayerView(null);
    }
    setOpenConfirmDelete(false);
  }

  const htmlPlayers = ( listPlayers.length > 0 ? (
    <List>
      {listPlayers.map((player: IPlayer) => {
        let listActions = [];
        listActions.push(
          <IconButton 
            key={`action-view-player-${player.id}`}
            aria-label={`${player.name} Profile`}
            title={`${player.name} Profile`}
            >
            <Link to={`/player/${player.id}`}>
              <AccountBoxIcon />
            </Link>
          </IconButton>
        )
        if( isAdmin ) {
          listActions.push(
            <IconButton 
              key={`action-delete-player-${player.id}`}
              aria-label={`Delete Player ${player.name}`}
              title={`Delete Player ${player.name}`}
              onClick={ () => handleOpenConfirmDelete(player) }
              >
              <Delete />
            </IconButton>
            
          )
        }
        return (
          <ListItem 
            key={`player-${player.id}`}
            secondaryAction={ listActions.map((action) => action) }
            >{player.name}</ListItem>
        )
      })}
      
    </List>
  ) : '' );
  
  return (
    <div className="public-layout">
      <h2>Player List</h2>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { apiSuccess && <Alert severity="success">{apiSuccess}</Alert> }
      { htmlPlayers }
      { currentPlayerView && isAdmin && (
        <ConfirmDelete
          isOpen={isModalOpenConfirmDelete}
          callbackCloseModal={cbCloseModalDelete}
          callbackConfirmDelete={cbCloseConfirmDelete}
          title={`Confirm player deletion`}
          description={`Are-you sure you want to delete the player '${currentPlayerView.name}'?`}
          />
      ) }
    </div>
  )
}
export default ListPlayers;