import { useState } from "react";

import { Box, CircularProgress, Alert, Snackbar } from "@mui/material";

interface IInfoDialog {
  isLoading?:   boolean;
  msgInfo?:     string;
  msgSuccess?:  string;
  msgWarning?:  string;
  msgError?:    string;
}

function InfoDialog(props: IInfoDialog) {

  const { isLoading, msgInfo, msgSuccess, msgWarning, msgError } = props;
  
  const [openSuccess, setOpenSuccess] = useState<boolean>(!!msgSuccess);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  }

  return (
    <>
      { isLoading === false && (
        <Box><CircularProgress /></Box>
      )}
      { !!msgInfo && (
        <Alert severity="info">{msgInfo}</Alert>
      )}
      { !!msgSuccess && (
        <Snackbar anchorOrigin={{ horizontal:'center', vertical:'top' }} open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess} >
          <Alert onClose={handleCloseSuccess} severity="success">{msgSuccess}</Alert>
        </Snackbar>
      )}
      { !!msgWarning && (
        <Alert severity="warning">{msgWarning}</Alert>
      )}
      { !!msgError && (
        <Alert severity="error">{msgError}</Alert>
      )}
      
    </>
  )
}

export default InfoDialog;
