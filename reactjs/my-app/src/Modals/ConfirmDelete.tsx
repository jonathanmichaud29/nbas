import { useEffect, useState } from "react";

import { Button, Box, Modal, Typography, ButtonGroup } from "@mui/material";

import { IConfirmDeleteProps } from "../Interfaces/Generic";

import styleModal from './styleModal'

/**
 * TODO: 
 * - Title, Description should be set from the parent.
 * - Add a separate callback for Cancel and Confirm
 */

function ConfirmDelete(props: IConfirmDeleteProps) {

  const { isOpen, title, description, callback_confirm_delete, callback_close_modal } = props;

  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    callback_close_modal();
  }

  const handleModalConfirm = () => {
    setModalOpen(false);
    callback_confirm_delete();
  }

  useEffect(() => {
    setModalOpen(isOpen);
    /* if( isOpen ){
      switch( context ){
        case "team":
          setModalTitle('Confirm team deletion');
          setModalDescription(`Are-you sure you want to delete the team '${selected_team?.name}'?`);
          break;
        case "player":
          setModalTitle('Confirm player deletion');
          setModalDescription(`Are-you sure you want to delete the player '${selected_player?.name}'?`);
          break;
        case "match":
          setModalTitle('Confirm match deletion');
          setModalDescription(`Are-you sure you want to delete the match '${selected_match?.id}'?`);
          break;
      }
    } */
  }, [isOpen/* , context, selected_team, selected_player, selected_match */]);
  
  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" paragraph={true}>
          {description}
        </Typography>
        <ButtonGroup variant="contained" aria-label="Confirmation choices">
          <Button
            variant="outlined"
            onClick={ handleModalClose }
          >Cancel</Button>
          <Button
             onClick={ handleModalConfirm }
          >Delete</Button>
        </ButtonGroup>
      </Box>
    </Modal>
  )
}

export default ConfirmDelete;