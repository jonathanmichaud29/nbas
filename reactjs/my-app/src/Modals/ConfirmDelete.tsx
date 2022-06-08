import { useEffect, useState } from "react";

import { Button, Box, Modal, Typography, ButtonGroup } from "@mui/material";

import { IConfirmDeleteProps } from "../Interfaces/Generic";

import styleModal from './styleModal'

function ConfirmDelete(props: IConfirmDeleteProps) {

  const { isOpen, title, description, callbackConfirmDelete, callbackCloseModal } = props;

  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    callbackCloseModal();
  }

  const handleModalConfirm = () => {
    setModalOpen(false);
    callbackConfirmDelete();
  }

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);
  
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