import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button, Autocomplete, TextField, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";

import { ITeamPlayersProps } from "../Interfaces/team";
import { IPlayer } from "../Interfaces/player";

import { fetchUnassignedPlayers, addTeamPlayer, IApiAddTeamPlayerParams } from '../ApiCall/teamsPlayers'

import LoaderInfo from "../Generic/LoaderInfo";

const defaultValues = {
  player: {},
}

interface IFormInput {
  player: IPlayer;
}

function AddTeamPlayer(props: ITeamPlayersProps) {

  const {isOpen, selectedTeam, callbackCloseModal} = props;
  
  /**
   * Set States
   */
  const [isModalOpen, setModalOpen] = useState(props.isOpen);
  const [listUnassignedPlayers, setUnassignedPlayers] = useState<IPlayer[]>([]);
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);
  const [incrementAcIndex, setIncrementAcIndex] = useState(1);

  const reinitializeApiMessages = () => {
    changeApiSuccess("")
    changeApiError("")
  }

  const handleModalClose = () => {
    setModalOpen(false);
    callbackCloseModal();
    reinitializeApiMessages();
  }

  useMemo(() => {
    if ( ! isOpen ) return;

    fetchUnassignedPlayers()
      .then(response => {
        const listPlayers: IPlayer[] = response.data || [];
        listPlayers.sort((a,b) => a.name.localeCompare(b.name))
        setUnassignedPlayers(listPlayers);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setModalOpen(true);
      });
  }, [isOpen]);

  
  /**
   * Form behaviors
   */
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus || ! selectedTeam ) return;

    setRequestStatus(true);
    reinitializeApiMessages();

    const paramsAddTeamPlayer: IApiAddTeamPlayerParams = {
      teamId: selectedTeam.id,
      playerId: data.player.id,
    }
    addTeamPlayer(paramsAddTeamPlayer)
      .then((response) =>{
        reset()
        setIncrementAcIndex(incrementAcIndex+1);
        changeApiSuccess(response.message);
        setUnassignedPlayers(listUnassignedPlayers.filter((player: IPlayer) => player.id !== response.data.idPlayer));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setRequestStatus(false);
      })
      
  }

  return (
    <Dialog
      open={isModalOpen}
      
    >
      <DialogTitle textAlign="center">Add player to <b>{selectedTeam?.name}</b></DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
          <LoaderInfo
            msgSuccess={apiSuccess}
            msgError={apiError}
          />
      
          <Controller
            name={"player"}
            control={control}
            rules={{ 
              required: "This is required",
            }}
            render={({ field: { onChange, value } }) => (
              <Autocomplete 
                id={"player-autocomplete"}
                onChange={(_, data) => {
                  onChange(data);
                  return data;
                }}
                key={`playcer-ac-${incrementAcIndex}`}
                options={listUnassignedPlayers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id }
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Available Players" 
                    error={errors.player ? true : false} 
                    helperText={errors.player ? (errors.player as any).message : '' }
                  />
                )}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Stack spacing={1} rowGap={1} alignItems="center" justifyContent="center" direction="row" flexWrap="wrap">
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={requestStatus}
            startIcon={requestStatus && (
              <CircularProgress size={14}/>
            )}
          >{requestStatus ? 'Request Sent' : 'Add player to team'}</Button>
          <Button
            onClick={handleModalClose}
            variant="outlined"
          >Close</Button>
        </Stack>
        
      </DialogActions>
    </Dialog>
  )
}
export default AddTeamPlayer;