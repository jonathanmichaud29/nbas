import { useEffect, useState } from "react";
import { Box, Modal, Typography, List, ListItem } from "@mui/material";

import { ITeamPlayers, ITeamPlayersProps } from "../Interfaces/Team";
import { fetchTeamPlayers } from "../ApiCall/teams";


const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



function ViewTeamPlayers(props: ITeamPlayersProps) {

  const {is_open, selected_team} = props;
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [listTeamPlayers, setListTeamPlayers] = useState<ITeamPlayers[]>([]);
  const [error, setError] = useState("");
  
  const handleModalClose = () => {
    setListTeamPlayers([]);
    setModalOpen(false);
  }

  useEffect(() => {
    if ( is_open && selected_team !== undefined ) {
      fetchTeamPlayers(selected_team.id)
        .then(response => {
          setListTeamPlayers(response.data);
        })
        .catch(error => {
          console.error("Error fetching team players", error)
          setError(error);
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
          { error ? (
            <p className="msg error">{error}</p>
          ) : ''}
          { is_open && listTeamPlayers ? (
            <List>
              { listTeamPlayers.map((team_player: ITeamPlayers) => (
                <ListItem key={`team-player-${team_player.team_id}-${team_player.team_id}`}>{team_player.player_name}</ListItem>
              ))}
            </List>
          ) : (
            <p className="msg info">There is no rooster for this team</p>
          ) }
        </Box>
      </Modal>
    </>
  )
}
export default ViewTeamPlayers;