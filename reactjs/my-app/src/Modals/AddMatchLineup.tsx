import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'

import { Button, Autocomplete, TextField, DialogActions, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayer } from "../redux/matchPlayerSlice";

import { IAddMatchLineupProps, IMatchLineup } from "../Interfaces/match";
import { IPlayer } from "../Interfaces/player";
import { ITeamPlayers, IOrderPlayers } from '../Interfaces/team'

import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from "../ApiCall/teamsPlayers";
import { addMatchLineups, IApiAddMatchLineupsParams } from '../ApiCall/matches';

import LoaderInfo from "../Generic/LoaderInfo";

const defaultValues = {
  player: {},
}

interface IFormInput {
  player: IOrderPlayers;
}

export default function AddMatchLineup(props: IAddMatchLineupProps) {
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

  const [orderPlayersByTeam, setOrderPlayersByTeam] = useState<IOrderPlayers[]>([]);

  const listPlayers = useSelector((state: RootState) => state.players )
  const selectCurrentMatchPlayers = createSelector(
    (state: RootState) => state.matchPlayers,
    (matchPlayers) => matchPlayers.find((myMatchPlayers) => myMatchPlayers.match.id === match.id)
  )
  const allMatchPlayers = useSelector(selectCurrentMatchPlayers) || null;
  

  useEffect(() => {
    if( ! isOpen ) return;
    setModalOpen(true);
  }, [isOpen])

  /**
   * Fetch Team Players depending on the selected team
   */
  useMemo(() => {
    if( selectedTeam === null) return;
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
        
      });
  }, [selectedTeam]);

  
  /**
   * Fetch Team Players depending on the selected team
   */
  useMemo(() => {
    const listActivePlayerIds = allMatchPlayers?.lineupPlayers.map((lineupPlayer: IMatchLineup) => lineupPlayer.idPlayer) || [];
    
    // Player's Categorisation and add new attributes helping to sort them in the list
    let listOrderPlayers: IOrderPlayers[] = listPlayers.map((player: IPlayer) => {
      const teamPlayerFound = listTeamsPlayers.find((teamPlayer) => teamPlayer.playerId === player.id) || null;
      return {
        currentTeamName: ( teamPlayerFound !== null ? teamPlayerFound.teamName : 'Reservist' ),
        priority: ( teamPlayerFound !== null ? 1 : 0 ),
        ...player
      }
    });
    
    // Remove Players that are actually in this match lineup
    listOrderPlayers = listOrderPlayers.filter((orderPlayer: IOrderPlayers) => {
      return listActivePlayerIds.find((elem: number) => elem === orderPlayer.id ) === undefined
    })
    // Order them by priority (high to low), then team name (alphabetically) and player name (alphabetically)
    listOrderPlayers.sort((a,b) => b.priority - a.priority || -b.currentTeamName.localeCompare(a.currentTeamName) || -b.name.localeCompare(a.name) )
    setOrderPlayersByTeam(listOrderPlayers);
  },[allMatchPlayers?.lineupPlayers, listPlayers, listTeamsPlayers])

  /**
   * Form behaviors
   */
  const reinitializeApiMessages = () => {
    changeApiSuccess("")
    changeApiError("")
  }

  const handleModalClose = () => {
    setModalOpen(false);
    callbackCloseModal();
    reinitializeApiMessages();
  }

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
    <Dialog
      open={isModalOpen}
    >
      <DialogTitle>Add <b>{selectedTeam?.name}</b> sub players</DialogTitle>
      <DialogContent>
        <Stack pt={1} pb={1} spacing={3}>
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
                disablePortal={false}
                onChange={(_, data) => {
                  onChange(data);
                  return data;
                }}
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack spacing={1} rowGap={1} alignItems="center" justifyContent="center" direction="row" flexWrap="wrap">
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
          >Add player to team</Button>
          <Button
            onClick={handleModalClose}
            variant="outlined"
          >Close</Button>
        </Stack>
      </DialogActions>
    </Dialog>
    
  )
}