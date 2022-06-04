import { useEffect, useState } from "react";

import { Button, Box, Modal, Typography, ButtonGroup } from "@mui/material";

import { IConfirmDeleteProps } from "../Interfaces/Generic";

import styleModal from './styleModal'

function ConfirmDelete(props: IConfirmDeleteProps) {

  const { is_open, context, selected_team, selected_player, callback_close_modal } = props;

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const handleModalClose = () => {
    setModalOpen(false);
    callback_close_modal();
  }

  const clickConfirm = () => {
    switch( context ){
      case "team":
        callback_close_modal(selected_team);
        break;
      case "player":
        callback_close_modal(selected_player);
        break;
    }
  }

  useEffect(() => {
    setModalOpen(is_open);
    if( is_open ){
      switch( context ){
        case "team":
          setModalTitle('Confirm team deletion');
          setModalDescription(`Are-you sure you want to delete the team '${selected_team?.name}'?`);
          break;
        case "player":
          setModalTitle('Confirm player deletion');
          setModalDescription(`Are-you sure you want to delete the player '${selected_player?.name}'?`);
          break;
      }
    }
  }, [is_open, context, selected_team, selected_player]);
  
  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {modalTitle}
        </Typography>
        <Typography id="modal-modal-description" paragraph={true}>
          {modalDescription}
        </Typography>
        <ButtonGroup variant="contained" aria-label="Confirmation choices">
          <Button
            variant="outlined"
            onClick={ () => handleModalClose()}
          >Cancel</Button>
          <Button
             onClick={ () => clickConfirm()}
          >Delete</Button>
        </ButtonGroup>
      </Box>
    </Modal>
  )
}

export default ConfirmDelete;