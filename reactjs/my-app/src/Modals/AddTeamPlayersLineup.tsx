import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Button, Checkbox, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormGroup, FormControlLabel, FormHelperText, 
  Stack } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";

import { defaultMatchLineupData, IAddMatchLineupProps } from "../Interfaces/match";

import { addMatchLineups, IApiAddMatchLineupsParams } from '../ApiCall/matches';

import LoaderInfo from "../Generic/LoaderInfo";
import { findAvailabilityMatchPlayers } from "../utils/dataFilter";
import { IPlayer } from "../Interfaces/player";


const defaultValues = {
  players: [] as IPlayer[],
}

interface IFormInput {
  players: IPlayer[];
}

export default function AddTeamPlayersLineup(props: IAddMatchLineupProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {isOpen, match, selectedTeam, callbackCloseModal} = props;
  
  /**
   * Set States
   */
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);

  const matchPlayers = useSelector((state: RootState) => state.matchPlayers).find((matchPlayers) => matchPlayers.match.id === match.id) || null;
  const listTeamPlayers = useSelector((state: RootState) => state.teamPlayers);
  const listPlayers = useSelector((state: RootState) => state.players);

  const { unassignedTeamPlayerIds } = findAvailabilityMatchPlayers(matchPlayers, listTeamPlayers, selectedTeam)
  const availablePlayers = listPlayers.filter((player) => unassignedTeamPlayerIds.includes(player.id)) || [];
  

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
    if( ! isOpen ) return;
    setModalOpen(isOpen);
  },[isOpen])

  /**
   * Form behaviors
   */
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, getValues, formState: { errors } } = methods;
  
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus || ! selectedTeam ) return;
    setRequestStatus(true);

    const playerIds = data.players.map((player) => player.id);
    const paramsAddMatchLineup: IApiAddMatchLineupsParams = {
      matchId: match.id,
      teamId: selectedTeam.id,
      playerIds: playerIds,
    }
    addMatchLineups(paramsAddMatchLineup)
      .then((response) =>{
        reset()
        let newPlayers = []
        for( const dataTeamPlayer of response.data){
          const newItem = {
            id: dataTeamPlayer.id,
            idMatch: dataTeamPlayer.idMatch,
            idTeam: dataTeamPlayer.idTeam,
            idPlayer: dataTeamPlayer.idPlayer
          }
          newPlayers.push({...defaultMatchLineupData, ...newItem})
        }
        
        dispatch(addMatchPlayers(match,newPlayers));
        handleModalClose();
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {
        setRequestStatus(false);
      });
    
  }

  const handleCheckPlayer = (checkedPlayer:IPlayer) => {
    const { players: ids } = getValues();
    const newIds = ids?.includes(checkedPlayer)
      ? ids?.filter(id => id !== checkedPlayer)
      : [...(ids ?? []), checkedPlayer];
    return newIds;
  };

  return (
    
    <Dialog
      open={isModalOpen}
    >
      <DialogTitle>Add <b>{selectedTeam?.name}</b> rooster players</DialogTitle>
      <DialogContent>
        <Stack pt={1} pb={1} spacing={3}>
          <LoaderInfo
            msgSuccess={apiSuccess}
            msgError={apiError}
          />
          { availablePlayers && availablePlayers.length ? (
            <FormGroup>
              {errors.players && ( <FormHelperText error={true}>{(errors.players as any).message}</FormHelperText> ) }
              
              <Controller
                name={"players"}
                control={control}
                rules={{ 
                  required: "Check at least one player",
                }}
                
                render={({ field: { onChange, value } }) => (
                  <>
                    { availablePlayers.map((player) => {
                      
                      return (
                        <FormControlLabel 
                          key={`player-checkbox-${player.id}`} 
                          label={`${player.name}`}
                          control={
                            <Checkbox 
                              value={player}
                              onChange={() => onChange(handleCheckPlayer(player))}
                            />
                          }  
                        />
                      )
                    })}
                  </>
                  
                )}
              />
            </FormGroup>
          ) : (
            <Alert severity="info">No players available</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack spacing={1} rowGap={1} alignItems="center" justifyContent="center" direction="row" flexWrap="wrap">
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
          >Add players to lineup</Button>
          <Button
            onClick={handleModalClose}
            variant="outlined"
          >Close</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}