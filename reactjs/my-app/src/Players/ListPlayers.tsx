import { useState, useMemo } from 'react';
import { batch, useDispatch, useSelector } from "react-redux";

import { Alert, Box, Card, CardActions, CardHeader, Grid, IconButton, Paper, Stack, Tooltip, Typography  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { AppDispatch, RootState } from "../redux/store";
import { addPlayers, removePlayer } from "../redux/playerSlice";
import { addLeaguePlayers, removeLeaguePlayer } from "../redux/leaguePlayerSlice";

import { IPlayer, IPlayerProps } from '../Interfaces/player';
import { ILeaguePlayer } from '../Interfaces/league';

import { 
  deleteLeaguePlayer, fetchLeaguePlayers, fetchPlayers, 
  IApiDeleteLeaguePlayerParams, IApiFetchLeaguePlayersParams, IApiFetchPlayersParams 
} from '../ApiCall/players'

import ConfirmDelete from "../Modals/ConfirmDelete";
import InfoDialog from '../Generic/InfoDialog';
import LoaderInfo from '../Generic/LoaderInfo';
import SearchPlayer from './SearchPlayer';

import { filterPlayersByName } from '../utils/dataFilter';
import { quickLinkPlayer } from '../utils/constants';


function ListPlayers(props: IPlayerProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { isAdmin, hasFilter } = props;

  const [apiError, changeApiError] = useState<string>("");
  const [apiSuccess, changeApiSuccess] = useState<string>("");
  const [filterTerm, setFilterTerm] = useState<string>("");

  const listPlayers = useSelector((state: RootState) => state.players )
  
  let filteredPlayers = filterPlayersByName([...listPlayers], filterTerm);
  filteredPlayers.sort((a:IPlayer, b:IPlayer) => a.name.localeCompare(b.name));

  const changeFilterTerm = (term: string) => {
    setFilterTerm(term);
  }

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
        
        const leaguePlayerToRemove: ILeaguePlayer = {
          idPlayer: response.data.idPlayer,
          idLeague: response.data.idLeague,
        }
        batch(() =>{
          dispatch(removePlayer(response.data.playerId));
          dispatch(removeLeaguePlayer(leaguePlayerToRemove));
        })
        changeApiSuccess(response.message)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {

      });
  }

  
  
  useMemo(() => {
    const getLeaguePlayers = async() => {
      const paramsFetchLeaguePlayers: IApiFetchLeaguePlayersParams = {
        
      }
      const myLeaguePlayers: [ILeaguePlayer] = await fetchLeaguePlayers(paramsFetchLeaguePlayers)
        .then(response => {
          dispatch(addLeaguePlayers(response.data));
          return response.data;
        })
        .catch(error => {
          changeApiError(error);
          return [];
        })
        .finally(() => {
          return [];
        });
  
      const playerIds = myLeaguePlayers.map((leaguePlayer) => leaguePlayer.idPlayer);
      const paramsFetchPlayers: IApiFetchPlayersParams = {
        playerIds: playerIds
      }
      await fetchPlayers(paramsFetchPlayers)
        .then(response => {
          dispatch(addPlayers(response.data));
        })
        .catch(error => {
          changeApiError(error);
        })
        .finally(() => {
          
        });
    }
    getLeaguePlayers();    
  }, [dispatch]);


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

  
  const htmlPlayers = ( filteredPlayers && filteredPlayers.length > 0 ? (
    <Box p={3} width="100%">
      <Grid container spacing={3} flexWrap="wrap"
        sx={{
          flexDirection:{xs:"column", sm:"row"}
        }}
      >
        { filteredPlayers.map((player: IPlayer) => {
          let listActions = [];
          let actionLabel=`${player.name} Profile`;
          listActions.push(
            <Tooltip title={actionLabel} key={`action-view-leaguePlayer-${player.id}`}>
              <IconButton color="primary"
                aria-label={actionLabel}
                href={`${quickLinkPlayer.link}/${player.id}`}
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
            <Grid item 
              key={`player-row-${player.id}`} 
              xs={12} sm={6} md={4} lg={3}
            >
              <Card raised={true}
                sx={{
                  '&:hover' : {
                    backgroundColor:"#efefef"
                  }
                }}
              >
                <CardHeader 
                  title={player.name}
                  titleTypographyProps={{variant:'h6'}}
                />
                <CardActions 
                  sx={{
                    justifyContent:'center'
                  }}
                >
                  {listActions}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  ) : (
    <Alert severity='info'>{ filterTerm ? 'No player matching your search' : 'No player found this season'}</Alert>
  ));
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">Player list</Typography>
        <Alert severity='info'>This list show all players from the current league. The season does not change the list.</Alert>
        { hasFilter && (
          <SearchPlayer 
            onChangeName={changeFilterTerm}
          />
        )}
        <LoaderInfo
          msgError={apiError}
        />
        { apiSuccess && (
          <InfoDialog
            msgSuccess={apiSuccess}
          />
        )}
        
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