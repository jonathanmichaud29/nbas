import { useEffect, useMemo, useState } from "react";

import { Alert, List, ListItem, IconButton, Dialog, DialogContent, DialogTitle, Stack, Button, DialogActions } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { ITeamPlayers, ITeamPlayersProps } from "../Interfaces/team";

import { fetchTeamsPlayers, deleteTeamPlayer, IApiFetchTeamsPlayersParams, IApiDeleteTeamPlayerParams } from '../ApiCall/teamsPlayers'

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
        const newList = listTeamPlayers.filter((tp) => tp.playerId !== teamPlayer.playerId && tp.teamId === teamPlayer.teamId )
        newList.sort((a,b) => a.playerName.localeCompare(b.playerName));
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
    if( ! isOpen ) return;
    setModalOpen(true);
  }, [isOpen])
  

  useMemo(() => {
    if ( selectedTeam === null ) return;

    const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
      teamIds: [selectedTeam.id],
    }
    fetchTeamsPlayers(paramsFetchTeamsPlayers)
      .then(response => {
        const newList: ITeamPlayers[] = response.data;
        newList.sort((a,b) => a.playerName.localeCompare(b.playerName));
        setListTeamPlayers(newList);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [selectedTeam]);

  return (
    <Dialog
      open={isModalOpen}
    >
      <DialogTitle textAlign="center"><b>{selectedTeam?.name}</b> players</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <LoaderInfo
            msgSuccess={apiSuccess}
            msgError={apiError}
          />

          { listTeamPlayers && listTeamPlayers.length > 0 ? (
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
          
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleModalClose}
          variant="outlined"
        >Close</Button>
      </DialogActions>

    </Dialog>
  )
}
export default ViewTeamPlayers;