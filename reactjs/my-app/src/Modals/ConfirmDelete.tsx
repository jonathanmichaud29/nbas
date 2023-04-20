import { useEffect, useState } from "react";

import { Button, Typography, Stack, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";

import { IConfirmDeleteProps } from "../Interfaces/generic";


function ConfirmDelete(props: IConfirmDeleteProps) {

  const { isOpen, title, description, warning, callbackConfirmDelete, callbackCloseModal } = props;

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
    <Dialog
      open={isModalOpen}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack pt={1} pb={1} spacing={3}>
          <Typography variant="body1">
            {description}
          </Typography>
          { warning ? (
            <Alert severity="warning">{warning}</Alert>
          ) : ''}
        </Stack>
      </DialogContent>
      <DialogActions sx={{flexDirection:{xs:'column', sm:'row'}}}>
        <Button
          variant="outlined"
          onClick={ handleModalClose }
        >Cancel</Button>
        <Button
          variant="contained"
          onClick={ handleModalConfirm }
        >Delete</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDelete;