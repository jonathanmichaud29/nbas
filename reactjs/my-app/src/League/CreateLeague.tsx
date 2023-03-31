import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Paper, Box, Stack, Typography, Button, CircularProgress } from "@mui/material";

import { AppDispatch } from "../redux/store";
import { addLeague } from "../redux/leagueSlice";

import { createLeague, IApiCreateLeagueParams } from "../ApiCall/leagues";

import FormTextInput from "../Forms/FormTextInput";
import LoaderInfo from "../Generic/LoaderInfo";
import { addAdminLeagues } from "../redux/adminContextSlice";

interface IFormInput {
  name: string;
}

export default function CreateLeague(){
  const dispatch = useDispatch<AppDispatch>();

  const [apiInfo, changeApiInfo] = useState<string>("");
  const [apiError, changeApiError] = useState<string>("");
  const [apiWarning, changeApiWarning] = useState<string>("");
  const [apiSuccess, changeApiSuccess] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<boolean>(false);

  const reinitializeApiMessages = () => {
    changeApiInfo('');
    changeApiError('');
    changeApiWarning('');
    changeApiSuccess('');
  }

  const defaultValues = {
    name: ""
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;

    setRequestStatus(true);
    reinitializeApiMessages();
    
    const paramsCreateLeague: IApiCreateLeagueParams = {
      name: data.name
    }
    createLeague(paramsCreateLeague)
      .then((response) =>{
        reset()
        dispatch(addLeague(response.data));
        dispatch(addAdminLeagues([response.data]));
        changeApiSuccess(response.message);

      })
      .catch(error => {
        changeApiError(error.message);
      })
      .finally(() => {
        setRequestStatus(false);
      })
      
  }

  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">Create new league</Typography>
        <LoaderInfo
          msgError={apiError}
          msgWarning={apiWarning}
          msgInfo={apiInfo}
          msgSuccess={apiSuccess}
        />
        <FormProvider {...methods}>
          <Stack spacing={1} alignItems="center">
            <FormTextInput
              label={`League name`}
              controllerName={`name`}
              type="text"
              isRequired={true}
            />
            <Button 
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={requestStatus}
              startIcon={requestStatus && (
                <CircularProgress size={14}/>
              )}
            >{requestStatus ? 'Request Sent' : 'Add League'}</Button>
          </Stack>
        </FormProvider>
      </Stack>
    </Paper>
  )
}