import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Alert, Button, Grid } from "@mui/material";

import { AppDispatch } from "../redux/store";
import { addPlayer } from '../redux/playerSlice';
import { addLeaguePlayer } from "../redux/leaguePlayerSlice";

import { createPlayer, IApiCreatePlayerParams } from '../ApiCall/players';

import { ILeaguePlayer, ILeaguePlayerDetails } from '../Interfaces/league';
import { IPlayer } from '../Interfaces/player';
import { IFieldPlayerExistsActions } from '../Interfaces/forms';

import FormTextInput from '../Forms/FormTextInput';
import FormRadioButtons from '../Forms/FormRadioButtons';

import { getStorageLeagueId } from '../utils/localStorage';




interface IFormInput {
  name: string;
  existingPlayer: number;
}

function CreatePlayer() {
  const dispatch = useDispatch<AppDispatch>();
  
  const [apiInfo, changeApiInfo] = useState("");
  const [apiError, changeApiError] = useState("");
  const [apiWarning, changeApiWarning] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);
  const [playerExistsActions, setPlayerExistsActions] = useState<IFieldPlayerExistsActions[]>([]);

  const defaultValues = {
    name: "",
    existingPlayer:0
  }

  const currentLeagueId = getStorageLeagueId();
  

  const reinitializeApiMessages = () => {
    changeApiInfo('');
    changeApiError('');
    changeApiWarning('');
    changeApiSuccess('');
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;

    setRequestStatus(true);
    reinitializeApiMessages();
    
    const paramsCreatePlayer: IApiCreatePlayerParams = {
      name: data.name,
    }
    if( playerExistsActions.length > 0 ){
      paramsCreatePlayer.existingPlayer = data.existingPlayer
    }
    createPlayer(paramsCreatePlayer)
      .then((response) =>{
        reset()
        changeApiSuccess(response.message);

        const dataPlayer: IPlayer = {
          id: response.data.playerId,
          name: response.data.playerName,
        }
        const dataLeaguePlayer: ILeaguePlayer = {
          idPlayer: response.data.playerId,
          idLeague: response.data.leagueId,
        }
        dispatch(addPlayer(dataPlayer));
        dispatch(addLeaguePlayer(dataLeaguePlayer));
        setPlayerExistsActions([]);
      })
      .catch(error => {
        
        if( error.code === 'playerExists' ){
          changeApiWarning(error.message);
          let listActions = [
            {label:"New player", value:0}
          ]
          // Find Player Ids that are already in the current league
          const currentLeaguePlayerIds = error.data.players.filter((playerLeagueDetails: ILeaguePlayerDetails) => {
            return playerLeagueDetails.leagueId === currentLeagueId
          }).map((playerLeagueDetails: ILeaguePlayerDetails) => playerLeagueDetails.playerId);

          if( currentLeaguePlayerIds.length > 0 ){
            changeApiInfo("This player name is already in this league.");
          }
          
          error.data.players.forEach((playerLeagueDetails: ILeaguePlayerDetails) => {
            if( currentLeaguePlayerIds.includes(playerLeagueDetails.playerId)) return;

            if( playerLeagueDetails.leagueId !== currentLeagueId ){
              if( playerLeagueDetails.leagueId !== null ) {
                listActions.push({
                  label:`Add ${playerLeagueDetails.playerName} from ${playerLeagueDetails.leagueName}`, 
                  value:playerLeagueDetails.playerId
                })
              }
              else {
                listActions.push({
                  label:`Add ${data.name} without league association`, 
                  value:playerLeagueDetails.playerId
                })
              }
            }
          })
          setPlayerExistsActions(listActions);
        }
        else {
          changeApiError(error.message);
          setPlayerExistsActions([]);
        }
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
        { apiWarning && (
          <Grid item pb={3}>
            <Alert severity="warning">{apiWarning}</Alert>
          </Grid>
        )}
        { apiInfo && (
          <Grid item pb={3}>
            <Alert severity="info">{apiInfo}</Alert>
          </Grid>
        )}
        { apiSuccess && (
          <Grid item pb={3}>
            <Alert severity="success">{apiSuccess}</Alert>
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
        { playerExistsActions && playerExistsActions.length > 0 && (
          <Grid item p={3}>
            <FormRadioButtons
              listValues={playerExistsActions}
              controllerName={`existingPlayer`}
              isRequired={true}
            />
          </Grid>
        )}
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