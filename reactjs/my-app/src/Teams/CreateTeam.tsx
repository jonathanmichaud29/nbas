import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button, CircularProgress, Stack, Typography } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { addTeam } from "../redux/teamSlice";
import { addLeagueTeam } from '../redux/leagueTeamSlice';

import { ILeagueTeam } from '../Interfaces/league';
import { ITeam } from '../Interfaces/team';

import { createTeam, IApiCreateTeamParams } from '../ApiCall/teams';

import FormTextInput from '../Forms/FormTextInput';
import LoaderInfo from '../Generic/LoaderInfo';

interface IFormInput {
  name: string;
}

function CreateTeam() {
  const dispatch = useDispatch<AppDispatch>();
  
  const stateAdminContext = useSelector((state: RootState) => state.adminContext )

  const currentLeagueName = stateAdminContext.currentLeague?.name || '';

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
          idSeason: response.data.seasonId,
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
    <Stack spacing={1} alignItems="center" pb={3}>
      <Typography variant="h1">Create new team</Typography>
      <Typography variant="subtitle1">{currentLeagueName}</Typography>
      <LoaderInfo
        msgError={apiError}
      />
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
    </Stack>
  );
}

export default CreateTeam;