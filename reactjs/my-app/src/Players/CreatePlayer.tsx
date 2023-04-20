import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { batch, useDispatch, useSelector } from "react-redux";

import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { addPlayer } from '../redux/playerSlice';
import { addLeaguePlayer } from "../redux/leaguePlayerSlice";

import { ILeaguePlayer, ILeaguePlayerDetails } from '../Interfaces/league';
import { IPlayer } from '../Interfaces/player';
import { IFieldPlayerExistsActions } from '../Interfaces/forms';

import { createPlayer, IApiCreatePlayerParams } from '../ApiCall/players';

import FormTextInput from '../Forms/FormTextInput';
import FormRadioButtons from '../Forms/FormRadioButtons';
import LoaderInfo from '../Generic/LoaderInfo';


interface IFormInput {
  name: string;
  existingPlayer: string;
}

function CreatePlayer() {
  const dispatch = useDispatch<AppDispatch>();

  const stateAdminContext = useSelector((state: RootState) => state.adminContext )
  const currentLeagueId = stateAdminContext.currentLeague?.id || 0;
  const currentLeagueName = stateAdminContext.currentLeague?.name || '';
  
  const [apiInfo, changeApiInfo] = useState<string>("");
  const [apiError, changeApiError] = useState<string>("");
  const [apiWarning, changeApiWarning] = useState<string>("");
  const [apiSuccess, changeApiSuccess] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<boolean>(false);
  const [playerExistsActions, setPlayerExistsActions] = useState<IFieldPlayerExistsActions[]>([]);

  const defaultValues = {
    name: "",
    existingPlayer:''
  }

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
        batch(()=>{
          dispatch(addPlayer(dataPlayer));
          dispatch(addLeaguePlayer(dataLeaguePlayer));
        })
        setPlayerExistsActions([]);
      })
      .catch(error => {
        
        if( error.code === 'playerExists' ){
          let listActions = [
            {label:"Create new player profile", value:'0'}
          ]

          // Find Player Ids that are already in the current league
          const currentLeaguePlayerIds = error.data.players.filter((playerLeagueDetails: ILeaguePlayerDetails) => {
            return playerLeagueDetails.leagueId === currentLeagueId /* && ! currentLeagueSeasonPlayerIds.includes(playerLeagueDetails.playerId) */
          }).map((playerLeagueDetails: ILeaguePlayerDetails) => playerLeagueDetails.playerId);
                    
          error.data.players.forEach((playerLeagueDetails: ILeaguePlayerDetails) => {
            if( currentLeaguePlayerIds.includes(playerLeagueDetails.playerId)) return;

            if( playerLeagueDetails.leagueId !== null ){
              if( playerLeagueDetails.leagueId !== null ) {
                listActions.push({
                  label:`Add ${playerLeagueDetails.playerName} from ${playerLeagueDetails.leagueName}`, 
                  value:playerLeagueDetails.playerId.toString()
                })
              }
              else {
                listActions.push({
                  label:`Add ${data.name} without league association`, 
                  value:playerLeagueDetails.playerId.toString()
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

  const resetPlayerActions = () => {
    changeApiInfo('');
    changeApiWarning('');
    setPlayerExistsActions([]);
  }

  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h1">{`${currentLeagueName}`} Players</Typography>
        <Typography variant="subtitle1">Add new player into league</Typography>
        <LoaderInfo
          msgError={apiError}
          msgWarning={apiWarning}
          msgInfo={apiInfo}
          msgSuccess={apiSuccess}
        />
        <FormProvider {...methods}>
          <Stack spacing={2} alignItems="center">
            <FormTextInput
              label={`New player name`}
              controllerName={`name`}
              type="text"
              isRequired={true}
              cbChange={resetPlayerActions}
            />

            { playerExistsActions && playerExistsActions.length > 0 && (
              <>
                <LoaderInfo
                  msgWarning={`This player name exists in the system. Select the appropriate option or change the player name.`}
                />
                <FormRadioButtons
                  listValues={playerExistsActions}
                  controllerName={`existingPlayer`}
                  isRequired={true}
                />
              </>
            )}

            <Button 
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={requestStatus}
              startIcon={requestStatus && (
                <CircularProgress size={14}/>
              )}
            >{requestStatus ? 'Request Sent' : 'Add Player'}</Button>

          </Stack>
        </FormProvider>
      </Stack>
    </Paper>
  );
}

export default CreatePlayer;