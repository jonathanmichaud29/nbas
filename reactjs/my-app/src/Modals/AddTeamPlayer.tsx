import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Alert, Paper, Button, Box, Modal, Typography, Autocomplete, TextField } from "@mui/material";

import { ITeamPlayersProps } from "../Interfaces/team";
import { IPlayer } from "../Interfaces/player";

import { fetchUnassignedPlayers, addTeamPlayer, IApiAddTeamPlayerParams } from '../ApiCall/teamsPlayers'

import styleModal from './styleModal'

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
  const [isModalOpen, setModalOpen] = useState(false);
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

  useEffect(() => {
    if ( ! isOpen ) return;

    fetchUnassignedPlayers()
      .then(response => {
        setUnassignedPlayers(response.data);
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
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add player to team <b>{selectedTeam?.name}</b>
          </Typography>
          
          <Paper>
            <Controller
              name={"player"}
              control={control}
              rules={{ 
                required: "This is required",
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete 
                  id={"player-autocomplete"}
                  disablePortal
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
            <Button 
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              >Add player to team</Button>

            { apiSuccess && <Alert security="success">{apiSuccess}</Alert> }
            { apiError && <Alert severity="error">{apiError}</Alert> }

          </Paper>
        </Box>
      </Modal>
    </>
  )
}
export default AddTeamPlayer;