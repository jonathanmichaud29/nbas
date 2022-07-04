import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayer } from "../redux/matchPlayerSlice";

import { Alert, Paper, Button, Box, Modal, Typography, Autocomplete, TextField } from "@mui/material";

import { IAddMatchLineupProps, IMatchLineup } from "../Interfaces/match";
import { IPlayer } from "../Interfaces/player";
import { ITeamPlayers, IOrderPlayers } from '../Interfaces/team'

import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from "../ApiCall/teamsPlayers";
import { addMatchLineups, IApiAddMatchLineupsParams } from '../ApiCall/matches';

import styleModal from './styleModal'

const defaultValues = {
  player: {},
}

interface IFormInput {
  player: IOrderPlayers;
}

function AddMatchLineup(props: IAddMatchLineupProps) {
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
  const [incrementAcIndex, setIncrementAcIndex] = useState(1);

  const [orderPlayersByTeam, setOrderPlayersByTeam] = useState<IOrderPlayers[]>([]);

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
    if ( selectedTeam === null ) return;
    const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
      allTeamsPlayers: true,
    }
    fetchTeamsPlayers(paramsFetchTeamsPlayers)
      .then(response => {
        setListTeamsPlayers(response.data);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setModalOpen(true);
      });
  }, [selectedTeam]);


  useEffect(() => {
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
  },[allMatchPlayers?.lineupPlayers, allPlayers, listTeamsPlayers, selectedTeam.id])

  /**
   * Form behaviors
   */
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus || ! selectedTeam ) return;
    setRequestStatus(true);
    reinitializeApiMessages();
    
    const paramsAddMatchLineup: IApiAddMatchLineupsParams = {
      matchId: match.id,
      teamId: selectedTeam.id,
      playerIds: [data.player.id],
    }
    addMatchLineups(paramsAddMatchLineup)
      .then((response) =>{
        reset()
        setIncrementAcIndex(incrementAcIndex+1);
        changeApiSuccess(response.message);
        const responseData = response.data[0];
        setOrderPlayersByTeam(orderPlayersByTeam.filter((player: IOrderPlayers) => player.id !== responseData.idPlayer));
        
        const newPlayer = {
          id: responseData.id,
          idMatch: responseData.idMatch,
          idTeam: responseData.idTeam,
          idPlayer: responseData.idPlayer,
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
        } as IMatchLineup;
        dispatch(addMatchPlayer(match,newPlayer));
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
            Add player to <b>{selectedTeam?.name}</b> match lineup 
          </Typography>
          
          <Paper>
            { orderPlayersByTeam && (
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
                    options={orderPlayersByTeam}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id }
                    groupBy={(option) => option.currentTeamName }
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
            )}
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
export default AddMatchLineup;