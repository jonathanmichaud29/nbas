import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Paper, Button, Box, Modal, Typography, Autocomplete, TextField } from "@mui/material";

import { ITeamPlayers, ITeamPlayersProps } from "../Interfaces/Team";
import { IPlayer } from "../Interfaces/Player";
import { fetchTeamPlayers, addTeamPlayer, fetchUnassignedPlayers } from "../ApiCall/teams";
import { AirlineSeatIndividualSuiteSharp } from "@mui/icons-material";
import { increment } from "firebase/firestore";


const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const defaultValues = {
  player: {},
}

interface IFormInput {
  player: IPlayer;
}

function AddTeamPlayer(props: ITeamPlayersProps) {

  const {is_open, selected_team, callback_close_modal} = props;
  
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
    callback_close_modal();
    reinitializeApiMessages();
  }

  useEffect(() => {
    if ( is_open ) {
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
      }
  }, [selected_team, is_open]);

  
  /**
   * Form behaviors
   */
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus || ! selected_team ) return;

    setRequestStatus(true);
    reinitializeApiMessages();

    addTeamPlayer(selected_team?.id, data.player.id)
      .then((response) =>{
        reset()
        setIncrementAcIndex(incrementAcIndex+1);
        changeApiSuccess(response.message);
        setUnassignedPlayers(listUnassignedPlayers.filter((player: IPlayer) => player.id !== response.data.id_player));
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
            Add player to team <b>{selected_team?.name}</b>
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