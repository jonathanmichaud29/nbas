import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addPlayers, removePlayer } from "../redux/playerSlice";
import { addLeaguePlayers, removeLeaguePlayer } from "../redux/leaguePlayerSlice";

import { Alert, Box, CircularProgress, IconButton, List, ListItem, Typography  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { deleteLeaguePlayer, fetchLeaguePlayers, fetchPlayers, IApiDeleteLeaguePlayerParams, IApiFetchLeaguePlayersParams, IApiFetchPlayersParams } from '../ApiCall/players'
import { IPlayer, IPlayerProps } from '../Interfaces/player';

import ConfirmDelete from "../Modals/ConfirmDelete";
import { ILeaguePlayer } from '../Interfaces/league';

function ListPlayers(props: IPlayerProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLeaguePlayersLoaded, setIsLeaguePlayersLoaded] = useState(false);
  const [isPlayersLoaded, setIsPlayersLoaded] = useState(false);

  const { isAdmin } = props;

  const listPlayers = useSelector((state: RootState) => state.players )
  const listLeaguePlayers = useSelector((state: RootState) => state.leaguePlayers )

  const isLoaded = isLeaguePlayersLoaded && isPlayersLoaded;

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeletePlayer = (player: IPlayer) => {
    reinitializeApiMessages()

    const paramsDeletePlayer: IApiDeleteLeaguePlayerParams = {
      idPlayer: player.id
    }
    deleteLeaguePlayer(paramsDeletePlayer)
      .then(response => {
        dispatch(removePlayer(response.data.playerId));
        const leaguePlayerToRemove: ILeaguePlayer = {
          idPlayer: response.data.idPlayer,
          idLeague: response.data.idLeague,
        }
        dispatch(removeLeaguePlayer(leaguePlayerToRemove));
        changeApiSuccess(response.message)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {

      });
  }
  
  useEffect(() => {
    const paramsFetchLeaguePlayers: IApiFetchLeaguePlayersParams = {
      
    }
    fetchLeaguePlayers(paramsFetchLeaguePlayers)
      .then(response => {
        dispatch(addLeaguePlayers(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLeaguePlayersLoaded(true);
      });
  }, [dispatch]);

  useEffect(() => {
    if( ! isLeaguePlayersLoaded || isPlayersLoaded ) return;
    
    const playerIds = listLeaguePlayers.map((leaguePlayer) => leaguePlayer.idPlayer);
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: playerIds
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        dispatch(addPlayers(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsPlayersLoaded(true);
      });
  }, [dispatch, isLeaguePlayersLoaded, isPlayersLoaded, listLeaguePlayers])

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

  const htmlPlayers = ( listPlayers && listPlayers.length > 0 ? (
    <List>
      {listPlayers.map((player: IPlayer) => {
        let listActions = [];
        listActions.push(
          <IconButton 
            key={`action-view-leaguePlayer-${player.id}`}
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
    <>
      <Typography variant="h4" align="center">
        Player List
      </Typography>
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
    </>
  )
}
export default ListPlayers;