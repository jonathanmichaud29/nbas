import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";

import { Alert, Button, Box, Checkbox, FormGroup, FormControlLabel, FormHelperText, Modal, Paper, Typography } from "@mui/material";

import { IAddMatchLineupProps, IMatchLineup } from "../Interfaces/match";
import { ITeamPlayers } from '../Interfaces/team'

import { addMatchLineups, IApiAddMatchLineupsParams } from '../ApiCall/matches';
import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from "../ApiCall/teamsPlayers";

import styleModal from './styleModal'


const defaultValues = {
  players: [] as ITeamPlayers[],
}

interface IFormInput {
  players: ITeamPlayers[];
}

function AddTeamPlayersLineup(props: IAddMatchLineupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {isOpen, match, selectedTeam, callbackCloseModal} = props;
  
  /**
   * Set States
   */
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const [listTeamsPlayers, setListTeamsPlayers] = useState<ITeamPlayers[]>([]);
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);

  const selectCurrentMatchPlayers = createSelector(
    (state: RootState) => state.matchPlayers,
    (matchPlayers) => matchPlayers.find((myMatchPlayers) => myMatchPlayers.match.id === match.id)
  )
  const allMatchPlayers = useSelector(selectCurrentMatchPlayers) || null;
  

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
    if ( selectedTeam === null || allMatchPlayers === null ) return;
    const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
      teamIds: [selectedTeam.id],
    }
    fetchTeamsPlayers(paramsFetchTeamsPlayers)
      .then(response => {
        const lineupPlayerIds = allMatchPlayers.lineupPlayers.map((lineupPlayer) => lineupPlayer.idPlayer)
        const listTeamPlayers: ITeamPlayers[] = response.data;
        const newListTeamPlayers = listTeamPlayers.filter((player: ITeamPlayers) => lineupPlayerIds.includes(player.playerId) === false);
        setListTeamsPlayers(newListTeamPlayers);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setModalOpen(true);
      });
  }, [allMatchPlayers, selectedTeam]);

  /**
   * Form behaviors
   */
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, getValues, formState: { errors } } = methods;
  
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus || ! selectedTeam ) return;
    
    setRequestStatus(true);
    const playerIds = data.players.map((teamPlayer: ITeamPlayers) => teamPlayer.playerId);
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
          newPlayers.push({
            id: dataTeamPlayer.id,
            idMatch: dataTeamPlayer.idMatch,
            idTeam: dataTeamPlayer.idTeam,
            idPlayer: dataTeamPlayer.idPlayer,
            atBats: 0,
            single: 0,
            double: 0,
            triple: 0,
            homerun: 0,
            out: 0,
            hitOrder: 0,
            hitByPitch: 0,
            walk: 0,
            strikeOut: 0,
            stolenBase: 0,
            caughtStealing: 0,
            plateAppearance: 0,
            sacrificeBunt: 0,
            sacrificeFly: 0,
            runsBattedIn: 0,
            hit: 0,
          } as IMatchLineup);
          
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

  const handleCheckPlayer = (checkedPlayer:ITeamPlayers) => {
    const { players: ids } = getValues();
    const newIds = ids?.includes(checkedPlayer)
      ? ids?.filter(id => id !== checkedPlayer)
      : [...(ids ?? []), checkedPlayer];
    return newIds;
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add <b>{selectedTeam?.name}</b> players to match lineup 
          </Typography>
          
          <Paper>
            { listTeamsPlayers && (
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
                      { listTeamsPlayers.map((teamPlayer: ITeamPlayers) => {
                        
                        return (
                          <FormControlLabel 
                            key={`player-checkbox-${teamPlayer.playerId}`} 
                            label={`${teamPlayer.playerName}`}
                            control={
                              <Checkbox 
                                value={teamPlayer}
                                onChange={() => onChange(handleCheckPlayer(teamPlayer))}
                              />
                            }  
                          />
                        )
                      })}
                    </>
                    
                  )}
                />
              </FormGroup>
            )}
            <Button 
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              >Add players to lineup</Button>

            { apiSuccess && <Alert security="success">{apiSuccess}</Alert> }
            { apiError && <Alert severity="error">{apiError}</Alert> }

          </Paper>
        </Box>
      </Modal>
    </>
  )
}
export default AddTeamPlayersLineup;