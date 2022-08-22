import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Alert, Box, Grid, IconButton, Paper, Stack, Tooltip, Typography  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { AppDispatch, RootState } from "../redux/store";
import { addPlayers, removePlayer } from "../redux/playerSlice";
import { addLeaguePlayers, removeLeaguePlayer } from "../redux/leaguePlayerSlice";

import { 
  deleteLeaguePlayer, fetchLeaguePlayers, fetchPlayers, 
  IApiDeleteLeaguePlayerParams, IApiFetchLeaguePlayersParams, IApiFetchPlayersParams 
} from '../ApiCall/players'

import { IPlayer, IPlayerProps } from '../Interfaces/player';
import { ILeaguePlayer } from '../Interfaces/league';

import ConfirmDelete from "../Modals/ConfirmDelete";

import InfoDialog from '../Generic/InfoDialog';
import LoaderInfo from '../Generic/LoaderInfo';

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
  const clearMsgSuccess = () => {
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
        setTimeout(clearMsgSuccess, 1500);
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

  const htmlPlayers = ( listPlayers && listPlayers.length > 0 ? listPlayers.map((player: IPlayer) => {
      let listActions = [];
      let actionLabel=`${player.name} Profile`;
      listActions.push(
        <Tooltip title={actionLabel} key={`action-view-leaguePlayer-${player.id}`}>
          <IconButton color="primary"
            aria-label={actionLabel}
            href={`/player/${player.id}`}
            >
            <AccountBoxIcon />
          </IconButton>
        </Tooltip>
      )
      if( isAdmin ) {
        actionLabel=`Delete Player ${player.name}`
        listActions.push(
          <Tooltip title={actionLabel} key={`action-delete-player-${player.id}`}>
            <IconButton color="primary"
              key={`action-delete-player-${player.id}`}
              aria-label={actionLabel}
              onClick={ () => handleOpenConfirmDelete(player) }
              >
              <Delete />
            </IconButton>
          </Tooltip>
          
        )
      }
      return (
        <Grid key={`match-row-${player.id}`} container columnSpacing={1} pt={1} pb={1} alignItems="center" flexWrap="nowrap" justifyContent="space-between"
          sx={{
            flexDirection:{xs:"column", sm:"row"},
            '&:hover':{
              backgroundColor:'#f1f1f1'
            }
        }}>
          <Grid item>{player.name}</Grid>
          <Grid item >{ listActions.map((action) => action )}</Grid>
        </Grid>
      )
  }) : (
    <Alert severity='info'>No player found this season</Alert>
  ));
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center" pb={3}>
        <Typography variant="h2">Player list</Typography>
        <LoaderInfo
          isLoading={isLoaded}
          msgError={apiError}
        />
        <InfoDialog
          msgSuccess={apiSuccess}
        />
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
      </Stack>
    </Paper>
  )
}
export default ListPlayers;