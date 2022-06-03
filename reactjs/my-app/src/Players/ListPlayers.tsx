import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Alert, Box, CircularProgress, IconButton, List, ListItem  } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { addPlayers, removePlayer } from "../redux/playerSlice";
import { deletePlayer, fetchPlayers } from '../ApiCall/players'
import { IPlayer, IPlayerProps } from '../Interfaces/Player';

import ConfirmDelete from "../Modals/ConfirmDelete";

function ListPlayers(props: IPlayerProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { is_admin } = props;

  const listPlayers = useSelector((state: RootState) => state ).players

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
  const [currentPlayerView, setCurrentPlayerView] = useState<IPlayer>();
  const [isModalOpenConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleOpenConfirmDelete = (player: IPlayer) => {
    setCurrentPlayerView(player);
    setOpenConfirmDelete(true);
  }
  
  const cbCloseConfirmDelete = (player?: IPlayer) => {
    if( player ) {
      confirmDeletePlayer(player);
    }
    setOpenConfirmDelete(false);
  }

  const htmlPlayers = ( listPlayers.length > 0 ? (
    <List>
      {listPlayers.map((player: IPlayer) => {
        let listActions = [];
        if( is_admin ) {
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
      { is_admin ? (
        <ConfirmDelete
          is_open={isModalOpenConfirmDelete}
          callback_close_modal={cbCloseConfirmDelete}
          selected_player={currentPlayerView}
          context="player"
          />
      ) : '' }
    </div>
  )
}
export default ListPlayers;