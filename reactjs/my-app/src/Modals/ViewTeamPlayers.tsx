import { useEffect, useState } from "react";
import { Alert, Box, Modal, Typography, List, ListItem, IconButton } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { ITeamPlayers, ITeamPlayersProps } from "../Interfaces/Team";
import { fetchTeamPlayers, removeTeamPlayer } from "../ApiCall/teams";

import styleModal from './styleModal'



function ViewTeamPlayers(props: ITeamPlayersProps) {

  const {is_admin, is_open, selected_team, callback_close_modal} = props;
  
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
    callback_close_modal();
    
  }

  const clickRemoveTeamPlayer = (team_player: ITeamPlayers) => {
    reinitializeApiMessages();

    removeTeamPlayer(team_player)
      .then((response) =>{
        const newList = listTeamPlayers.filter((tp) => { return tp.player_id !== team_player.player_id && tp.team_id === team_player.team_id; })
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
    if ( is_open && selected_team !== undefined ) {
      fetchTeamPlayers(selected_team.id)
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
  }, [selected_team, is_open]);

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <b>{selected_team?.name}</b> players
          </Typography>
          
          { is_open && listTeamPlayers ? (
            <List>
              { listTeamPlayers.map((team_player: ITeamPlayers) => {
                let listActions = [];
                if( is_admin ) {
                  listActions.push(
                    <IconButton 
                      aria-label={`Remove ${team_player.player_name} from team`}
                      title={`Remove ${team_player.player_name} from team`}
                      onClick={ () => clickRemoveTeamPlayer(team_player)}
                      >
                      <Delete />
                    </IconButton>
                  )
                }
                return (
                  <ListItem 
                    key={`team-player-${team_player.team_id}-${team_player.player_id}`}
                    secondaryAction={ listActions.map((action) => action) }
                    >{team_player.player_name}</ListItem>
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