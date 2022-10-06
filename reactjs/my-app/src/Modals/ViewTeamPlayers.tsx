import { useEffect, useState } from "react";

import { Alert, Box, Modal, Typography, List, ListItem, IconButton, Dialog, DialogContent, DialogTitle, Stack, Button, DialogActions } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { ITeamPlayers, ITeamPlayersProps } from "../Interfaces/team";

import { fetchTeamsPlayers, deleteTeamPlayer, IApiFetchTeamsPlayersParams, IApiDeleteTeamPlayerParams } from '../ApiCall/teamsPlayers'

import styleModal from './styleModal'
import LoaderInfo from "../Generic/LoaderInfo";



function ViewTeamPlayers(props: ITeamPlayersProps) {

  const {isAdmin, isOpen, selectedTeam, callbackCloseModal} = props;
  
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isModalOpen, setModalOpen] = useState(props.isOpen);
  const [listTeamPlayers, setListTeamPlayers] = useState<ITeamPlayers[]>([]);
  
  const reinitializeApiMessages = () => {
    changeApiSuccess("")
    changeApiError("")
  }
  const handleModalClose = () => {
    reinitializeApiMessages();
    setListTeamPlayers([]);
    setModalOpen(false);
    callbackCloseModal();
    
  }

  const clickRemoveTeamPlayer = (teamPlayer: ITeamPlayers) => {
    reinitializeApiMessages();
    const paramsDeleteTeamPlayer: IApiDeleteTeamPlayerParams = {
      teamId: teamPlayer.teamId,
      playerId: teamPlayer.playerId,
    }
    deleteTeamPlayer(paramsDeleteTeamPlayer)
      .then((response) =>{
        const newList = listTeamPlayers.filter((tp) => { return tp.playerId !== teamPlayer.playerId && tp.teamId === teamPlayer.teamId; })
        setListTeamPlayers(newList);
        changeApiSuccess(response.message)
      })
      .catch(error => {
        changeApiError(error)
      })
      .finally(() => {
        
      })
  }

  useEffect(() => {
    if ( ! isOpen || selectedTeam === null ) return;

    const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
      teamIds: [selectedTeam.id],
    }
    fetchTeamsPlayers(paramsFetchTeamsPlayers)
      .then(response => {
        setListTeamPlayers(response.data);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setModalOpen(true);
      });
  }, [selectedTeam, isOpen]);

  return (
    <Dialog
      open={isModalOpen}
    >
      <DialogTitle textAlign="center"><b>{selectedTeam?.name}</b> players</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          
          { listTeamPlayers ? (
            <List>
              { listTeamPlayers.map((teamPlayer: ITeamPlayers) => {
                let listActions = [];
                if( isAdmin ) {
                  listActions.push(
                    <IconButton 
                      key={`remove-team-player-${teamPlayer.teamId}-${teamPlayer.playerId}`}
                      aria-label={`Remove ${teamPlayer.playerName} from team`}
                      title={`Remove ${teamPlayer.playerName} from team`}
                      onClick={ () => clickRemoveTeamPlayer(teamPlayer)}
                      >
                      <Delete />
                    </IconButton>
                  )
                }
                return (
                  <ListItem 
                    key={`team-player-${teamPlayer.teamId}-${teamPlayer.playerId}`}
                    secondaryAction={ listActions.map((action) => action) }
                    sx={{
                      '&:hover':{
                        backgroundColor:'#efefef'
                      }
                    }}
                    >{teamPlayer.playerName}</ListItem>
                )
              })}
            </List>
          ) : (
            <Alert severity="info">There is no rooster for this team</Alert>
          ) }

          <LoaderInfo
            msgSuccess={apiSuccess}
            msgError={apiError}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Stack spacing={1} rowGap={1} alignItems="center" justifyContent="center" direction="row" flexWrap="wrap">
          <Button
            onClick={handleModalClose}
            variant="outlined"
          >Close</Button>
        </Stack>
      </DialogActions>

    </Dialog>
  )
}
export default ViewTeamPlayers;