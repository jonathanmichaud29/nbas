import { Box, CircularProgress, Alert, Dialog } from "@mui/material";

interface IInfoDialog {
  isLoading?:   boolean;
  msgInfo?:     string;
  msgSuccess?:  string;
  msgWarning?:  string;
  msgError?:    string;
}

function InfoDialog(props: IInfoDialog) {

  const { isLoading, msgInfo, msgSuccess, msgWarning, msgError } = props;

  return (
    <>
      { isLoading === false && (
        <Box><CircularProgress /></Box>
      )}
      { !!msgInfo && (
        <Alert severity="info">{msgInfo}</Alert>
      )}
      { !!msgSuccess && (
        <Dialog open={true}>
          <Alert severity="success">{msgSuccess}</Alert>
        </Dialog>
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
