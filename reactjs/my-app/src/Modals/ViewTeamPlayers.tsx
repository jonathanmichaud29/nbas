import { useEffect, useState } from "react";
import { Alert, Box, Modal, Typography, List, ListItem, IconButton } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { ITeamPlayers, ITeamPlayersProps } from "../Interfaces/team";
import { fetchTeamPlayers, removeTeamPlayer } from "../ApiCall/teams";

import styleModal from './styleModal'



function ViewTeamPlayers(props: ITeamPlayersProps) {

  const {isAdmin, isOpen, selectedTeam, callbackCloseModal} = props;
  
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
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

    removeTeamPlayer(teamPlayer)
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
    if ( isOpen && selectedTeam !== undefined ) {
      fetchTeamPlayers(selectedTeam.id)
        .then(response => {
          setListTeamPlayers(response.data);
        })
        .catch(error => {
          changeApiError(error);
        })
        .finally(() => {
          setModalOpen(true);
        });
      }
  }, [selectedTeam, isOpen]);

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <b>{selectedTeam?.name}</b> players
          </Typography>
          
          { isOpen && listTeamPlayers ? (
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
                    >{teamPlayer.playerName}</ListItem>
                )
                  })}
            </List>
          ) : (
            <Alert severity="info">There is no rooster for this team</Alert>
          ) }

          { apiError && <Alert severity="error">{apiError}</Alert> }
          { apiSuccess && <Alert severity="success">{apiSuccess}</Alert> }

        </Box>
      </Modal>
    </>
  )
}
export default ViewTeamPlayers;