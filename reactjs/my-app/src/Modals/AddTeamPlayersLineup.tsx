import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'

import { Button, Checkbox, FormGroup, FormControlLabel, FormHelperText, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";

import { IAddMatchLineupProps, IMatchLineup } from "../Interfaces/match";
import { ITeamPlayers } from '../Interfaces/team'

import { addMatchLineups, IApiAddMatchLineupsParams } from '../ApiCall/matches';
import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from "../ApiCall/teamsPlayers";

import LoaderInfo from "../Generic/LoaderInfo";


const defaultValues = {
  players: [] as ITeamPlayers[],
}

interface IFormInput {
  players: ITeamPlayers[];
}

export default function AddTeamPlayersLineup(props: IAddMatchLineupProps) {
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

  useMemo(() => {
    if ( selectedTeam === null || allMatchPlayers === null ) return;
    const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
      teamIds: [selectedTeam.id],
    }
    fetchTeamsPlayers(paramsFetchTeamsPlayers)
      .then(response => {
        const lineupPlayerIds = allMatchPlayers.lineupPlayers.map((lineupPlayer) => lineupPlayer.idPlayer)
        const listTeamPlayers: ITeamPlayers[] = response.data;
        const newListTeamPlayers = listTeamPlayers.filter((player: ITeamPlayers) => lineupPlayerIds.includes(player.playerId) === false);
        newListTeamPlayers.sort((a, b) => a.playerName.localeCompare(b.playerName))
        setListTeamsPlayers(newListTeamPlayers);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [allMatchPlayers, selectedTeam]);

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