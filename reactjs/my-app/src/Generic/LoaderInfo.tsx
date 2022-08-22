import { Box, CircularProgress, Alert} from "@mui/material";

interface ILoaderInfo {
  isLoading?:   boolean;
  msgInfo?:     string;
  msgSuccess?:  string;
  msgWarning?:  string;
  msgError?:    string;
  
}

function LoaderInfo(props: ILoaderInfo) {

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
        <Alert severity="success">{msgSuccess}</Alert>
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

export default LoaderInfo;
