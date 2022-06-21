import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";

import { Alert, Button, Box, Checkbox, FormGroup, FormControlLabel, FormHelperText, Modal, Paper, Typography } from "@mui/material";

import { IAddMatchLineupProps, IMatch, IMatchLineup } from "../Interfaces/match";
import { IPlayer } from "../Interfaces/player";
import { ITeamPlayers, IOrderPlayers } from '../Interfaces/team'

import { fetchTeamPlayers } from "../ApiCall/teams";
import { addLineupPlayers } from '../ApiCall/matches';

import styleModal from './styleModal'

const defaultValues = {
  players: [] as ITeamPlayers[],
}

interface IFormInput {
  players: ITeamPlayers[];
}

function AddTeamPlayersLineup(props: IAddMatchLineupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {isOpen, match, selectedTeam, callbackCloseModal, allPlayers} = props;
  
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
    fetchTeamPlayers(selectedTeam.id)
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


  /* useEffect(() => {
    if( listTeamsPlayers === null) return;

    const listActivePlayerIds = allMatchPlayers?.lineupPlayers.map((lineupPlayer: IMatchLineup) => lineupPlayer.idPlayer) || [];
    
    // Player's Categorisation and add new attributes helping to sort them in the list
    let listOrderPlayers: IOrderPlayers[] = allPlayers.map((player: IPlayer) => {
      const teamPlayerFound = listTeamsPlayers.find((teamPlayer) => teamPlayer.playerId === player.id) || null;
      return {
        currentTeamName: ( teamPlayerFound === null ? 'Reservist' : teamPlayerFound.teamName ),
        priority: ( teamPlayerFound !== null && teamPlayerFound.teamId === selectedTeam.id ? 1 : 0 ),
        ...player
      }
    });
    
    // Remove Player's Categorisation that are actually in this match lineup
    listOrderPlayers = listOrderPlayers.filter((orderPlayer: IOrderPlayers) => {
      return listActivePlayerIds.find((elem: number) => elem === orderPlayer.id ) === undefined
    })
    // Order them by priority, then team name and player name
    listOrderPlayers.sort((a,b) => b.priority - a.priority || -b.currentTeamName.localeCompare(a.currentTeamName) || -b.name.localeCompare(a.name) )
    setOrderPlayersByTeam(listOrderPlayers);
  },[allMatchPlayers?.lineupPlayers, allPlayers, listTeamsPlayers, selectedTeam.id]) */

  /**
   * Form behaviors
   */
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, getValues, formState: { errors } } = methods;
  
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus || ! selectedTeam ) return;
    
    setRequestStatus(true);
    const playerIds = data.players.map((teamPlayer: ITeamPlayers) => teamPlayer.playerId);

    addLineupPlayers(match.id, selectedTeam.id, playerIds)
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
        /* setModalOpen(true); */
      });
    /* setRequestStatus(true);
    reinitializeApiMessages();
 
    addMatchLineup(match.id, selectedTeam.id, data.player.id)
      .then((response) =>{
        reset()
        setIncrementAcIndex(incrementAcIndex+1);
        changeApiSuccess(response.message);
        setOrderPlayersByTeam(orderPlayersByTeam.filter((player: IOrderPlayers) => player.id !== response.data.idPlayer));
        const newPlayer = {
          id: response.data.id,
          idMatch: match.id,
          idTeam: selectedTeam.id,
          idPlayer: response.data.idPlayer,
          atBats: 0,
          single: 0,
          double: 0,
          triple: 0,
          homerun: 0,
          out: 0,
          hitOrder: 0,
        } as IMatchLineup;
        dispatch(addMatchPlayer(match,newPlayer));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setRequestStatus(false);
      }) */
      
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