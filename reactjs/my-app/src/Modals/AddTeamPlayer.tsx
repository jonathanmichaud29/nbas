import { useEffect, useState } from "react";
import { Button, Box, Modal, Typography, List, ListItem } from "@mui/material";

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

function AddTeamPlayer(props: ITeamPlayersProps) {

  const {is_open, selected_team, callback_close_modal} = props;
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [listTeamPlayers, setListTeamPlayers] = useState<ITeamPlayers[]>([]);
  const [error, setError] = useState("");

  const handleModalClose = () => {
    setListTeamPlayers([]);
    setModalOpen(false);
    callback_close_modal();
  }

  useEffect(() => {
    if ( is_open && selected_team !== undefined ) {
      fetchTeamPlayers(selected_team.id)
        .then(response => {
          setListTeamPlayers(response.data);
        })
        .catch(error => {
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
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add player to team <b>{selected_team?.name}</b>
          </Typography>
          { error ? (
            <p className="msg error">{error}</p>
          ) : ''}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  )
}
export default AddTeamPlayer;