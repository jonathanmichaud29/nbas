import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Alert,Button, Grid } from "@mui/material";

import { AppDispatch } from "../redux/store";
import { addTeam } from "../redux/teamSlice";
import { addLeagueTeam } from '../redux/leagueTeamSlice';

import { ILeagueTeam } from '../Interfaces/league';
import { ITeam } from '../Interfaces/team';

import { createTeam, IApiCreateTeamParams } from '../ApiCall/teams';

import FormTextInput from '../Forms/FormTextInput';




interface IFormInput {
  name: string;
}

function CreateTeam() {
  const dispatch = useDispatch<AppDispatch>();

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
    <FormProvider {...methods}>
      <Grid container direction="column" flexWrap="nowrap" alignItems="center">
        { apiError && (
          <Grid item pb={3}>
            <Alert severity="error">{apiError}</Alert>
          </Grid> 
        )}
        { apiSuccess && (
          <Grid item pb={3}>
            <Alert severity="success">{apiSuccess}</Alert>
          </Grid>
        )}
        <Grid item pb={3}>
          <FormTextInput
            label={`New team name`}
            controllerName={`name`}
            type="text"
            isRequired={true}
          />
        </Grid>
        
        <Grid item>
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            >Add new team</Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default CreateTeam;