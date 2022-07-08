import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Alert, Button, Grid } from "@mui/material";

import { AppDispatch } from "../redux/store";
import { addPlayer } from "../redux/playerSlice";

import { createPlayer, IApiCreatePlayerParams } from '../ApiCall/players';

import FormTextInput from '../Forms/FormTextInput';

interface IFormInput {
  name: string;
}

function CreatePlayer() {
  
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);

  const defaultValues = {
    name: "",
  }

  const dispatch = useDispatch<AppDispatch>();

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

    const paramsCreatePlayer: IApiCreatePlayerParams = {
      name: data.name
    }
    createPlayer(paramsCreatePlayer)
      .then((response) =>{
        reset()
        changeApiSuccess(response.message);
        dispatch(addPlayer(response.data));
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
          <Grid item>
            <Alert severity="error">{apiError}</Alert>
          </Grid> 
        )}
        { apiSuccess && (
          <Grid item>
            <Alert security="success">{apiSuccess}</Alert>
          </Grid>
        )}

        <Grid item pb={3}>
          <FormTextInput
            label={`New player name`}
            controllerName={`name`}
            type="text"
            isRequired={true}
          />
        </Grid>
        
        <Grid item>
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            >Add new player</Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default CreatePlayer;