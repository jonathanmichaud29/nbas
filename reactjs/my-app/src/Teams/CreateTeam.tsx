import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Box,Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";

import { AppDispatch } from "../redux/store";
import { addTeam } from "../redux/teamSlice";
import { addLeagueTeam } from '../redux/leagueTeamSlice';

import { ILeagueTeam } from '../Interfaces/league';
import { ITeam } from '../Interfaces/team';

import { createTeam, IApiCreateTeamParams } from '../ApiCall/teams';

import FormTextInput from '../Forms/FormTextInput';
import LoaderInfo from '../Generic/LoaderInfo';

import { getStorageLeagueName } from '../utils/localStorage';


interface IFormInput {
  name: string;
}

function CreateTeam() {
  const dispatch = useDispatch<AppDispatch>();
  const currentLeagueName = getStorageLeagueName();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);
 

  const defaultValues = {
    name: ""
  }

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;

    setRequestStatus(true);
    reinitializeApiMessages();

    const paramsCreateTeam: IApiCreateTeamParams = {
      name: data.name
    }
    createTeam(paramsCreateTeam)
      .then((response) =>{
        reset()
        changeApiSuccess(response.message);
        const dataTeam: ITeam = {
          id: response.data.teamId,
          name: response.data.teamName,
        }
        const dataLeagueTeam: ILeagueTeam = {
          idTeam: response.data.teamId,
          idLeague: response.data.leagueId,
        }
        dispatch(addTeam(dataTeam));
        dispatch(addLeagueTeam(dataLeagueTeam));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setRequestStatus(false);
      })
      
  }


  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={1} alignItems="center" pb={3}>
        <Typography variant="h1">{currentLeagueName}</Typography>
        <Typography variant="subtitle1">Add new team to league</Typography>
        <LoaderInfo
          msgError={apiError}
        />
      </Stack>

      <FormProvider {...methods}>
        <Stack spacing={2} alignItems="center">
          <FormTextInput
            label={`New team name`}
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
          >{requestStatus ? 'Request Sent' : 'Add new team'}</Button>

          <LoaderInfo
            msgSuccess={apiSuccess}
          />
        </Stack>
      </FormProvider>
    </Paper>
  );
}

export default CreateTeam;