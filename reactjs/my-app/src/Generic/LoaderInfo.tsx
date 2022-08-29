import { Box, CircularProgress, Alert, Paper, Stack} from "@mui/material";

interface ILoaderInfo {
  isLoading?:   boolean;
  msgInfo?:     string;
  msgSuccess?:  string;
  msgWarning?:  string;
  msgError?:    string;
  hasWrapper?: boolean;
  
}

function LoaderInfo(props: ILoaderInfo) {

  const { isLoading, msgInfo, msgSuccess, msgWarning, msgError, hasWrapper } = props;
  
  const hasDataSet = isLoading === false || !!msgInfo || !!msgSuccess || !!msgWarning || !!msgError;
  const htmlEffects = (
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

  if( ! hasDataSet ) return (
    <></>
  );
  
  return (
    <>
      { hasWrapper ? (
        <Paper component={Box} p={3} m={3}>
          <Stack spacing={3} alignItems="center" >
            {htmlEffects}
          </Stack>
        </Paper>
      ) : htmlEffects }
    </>
  )
}

export default LoaderInfo;
