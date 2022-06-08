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

  const { is_open, title, description, callback_confirm_delete, callback_close_modal } = props;

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
    setModalOpen(is_open);
  }, [is_open]);
  
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