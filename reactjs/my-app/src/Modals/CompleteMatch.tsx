import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'
import { Controller, SubmitHandler, useForm, useFieldArray, FormProvider } from "react-hook-form";

import { Alert, Paper, Button, Box, Grid, Modal, List, ListItem, Typography, Autocomplete, TextField } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"


import { AppDispatch, RootState } from "../redux/store";
import { removeMatchPlayer } from "../redux/matchPlayerSlice"

import { updateMatchLineup } from '../ApiCall/matches';

import { IPlayer } from "../Interfaces/Player";
import { ICompleteMatchProps, IMatchLineup, IPlayerLineupStats} from '../Interfaces/Match'

import FormNumberInput from '../Forms/FormNumberInput';

import { castNumber } from '../utils/castValues';
import styleModal from './styleModal'



interface IFormInput {
  /* player: IPlayer; */
  teamHomePoints: number;
  teamAwayPoints: number;
  playerStats: IPlayerLineupStats[];
}
const defaultValues = {
  /* player: {}, */
  teamHomePoints: 0,
  teamAwayPoints: 0,
  playerStats: []
}
function CompleteMatch(props: ICompleteMatchProps) {
  /* const dispatch = useDispatch<AppDispatch>(); */
  const {isOpen, match, teamHome, teamAway, callbackCloseModal, allPlayers} = props;
  
  /**
   * Set States
   */
  const [isModalOpen, setModalOpen] = useState(false);
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);

  const [lineupTeamHome, setLineupTeamHome] = useState<IMatchLineup[] | null>(null);
  const [lineupTeamAway, setLineupTeamAway] = useState<IMatchLineup[] | null>(null);

  const selectCurrentMatchPlayers = createSelector(
    (state: RootState) => state.matchPlayers,
    (matchPlayers) => matchPlayers.find((myMatchPlayers) => myMatchPlayers.match.id === match.id)
  )
  const allMatchPlayers = useSelector(selectCurrentMatchPlayers) || null;

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, setValue/* , formState: { errors } */ } = methods;
  const { fields, append, remove/* , prepend, remove, swap, move, insert */ } = useFieldArray(
    { control, name: "playerStats" }
  );
  const getPlayerName = (idPlayer: number): string => {
    const defaultReturn = "Player not found in lineup";
    if( allPlayers ){
      const playerFound = allPlayers.find((player: IPlayer) => player.id === idPlayer);
      if( playerFound ) return playerFound.name;
    }
    return defaultReturn;
  }

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
    setModalOpen(true);
  }, [isOpen]);

  useEffect( () => {
    if( allMatchPlayers === null ) return;
    const teamHomePlayers = allMatchPlayers.lineupPlayers.filter((lineupPlayer: IMatchLineup) => lineupPlayer.idTeam === teamHome.id )
    const teamAwayPlayers = allMatchPlayers.lineupPlayers.filter((lineupPlayer: IMatchLineup) => lineupPlayer.idTeam === teamAway.id )
    
    setLineupTeamHome(teamHomePlayers);
    setLineupTeamAway(teamAwayPlayers);
    
    setValue("teamHomePoints", allMatchPlayers.match.teamHomePoints);
    setValue("teamAwayPoints", allMatchPlayers.match.teamAwayPoints);
    
    // Remove all existing records from ReactHookForm->useFieldArray
    remove();
    
    teamHomePlayers.forEach((lineupPlayer: IMatchLineup) => append({
      lineupId: lineupPlayer.id, 
      hitOrder: lineupPlayer.hitOrder,
      atBats: lineupPlayer.atBats,
      single: lineupPlayer.single,
      double: lineupPlayer.double,
      triple: lineupPlayer.triple,
      homerun: lineupPlayer.homerun,
      out: lineupPlayer.out,
    }));
    teamAwayPlayers.forEach((lineupPlayer: IMatchLineup) => append({
      lineupId: lineupPlayer.id, 
      hitOrder: lineupPlayer.hitOrder,
      atBats: lineupPlayer.atBats,
      single: lineupPlayer.single,
      double: lineupPlayer.double,
      triple: lineupPlayer.triple,
      homerun: lineupPlayer.homerun,
      out: lineupPlayer.out,
    }));
  }, [allMatchPlayers, teamHome, teamAway, setValue, append, remove]);

  /**
   * Form behaviors
   */
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;
    console.log("data send", data);
    setRequestStatus(true);
    reinitializeApiMessages();


    let updatedMatch = Object.assign({},match);
    updatedMatch.isCompleted = 1;
    updatedMatch.teamHomePoints = data.teamHomePoints;
    updatedMatch.teamAwayPoints = data.teamAwayPoints;
    
    // Cast possible string values to numbers
    const formattedPlayerStats = data.playerStats.map((lineup: IPlayerLineupStats) => {
      return {
        hitOrder:   castNumber(lineup.hitOrder),
        atBats:     castNumber(lineup.atBats),
        single:     castNumber(lineup.single),
        double:     castNumber(lineup.double),
        triple:     castNumber(lineup.triple),
        homerun:    castNumber(lineup.homerun),
        lineupId:   castNumber(lineup.lineupId),
        out:        castNumber(lineup.out)
      }
    })

    updateMatchLineup(updatedMatch, formattedPlayerStats)
      .then((response) =>{
        changeApiSuccess(response.message);
        handleModalClose()
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
          <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
            Complete Match #<b>{match.id}</b>
          </Typography>
          
          <FormProvider {...methods}>
            <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
              <Grid container spacing={2}>
                <Grid item xs={6} alignContent="right">
                  <FormNumberInput
                    label={`${teamHome.name} Points`}
                    controllerName={`teamHomePoints`}
                    fieldMinValue={0}
                    isRequired={true}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormNumberInput
                    label={`${teamAway.name} Points`}
                    controllerName={`teamAwayPoints`}
                    fieldMinValue={0}
                    isRequired={true}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" component="h3" align="center">
                    {teamHome.name}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Player</TableCell>
                          <TableCell align="center">Bat Order</TableCell>
                          <TableCell align="center">At Bats</TableCell>
                          <TableCell align="center">Out</TableCell>
                          <TableCell align="center">Single</TableCell>
                          <TableCell align="center">Double</TableCell>
                          <TableCell align="center">Triple</TableCell>
                          <TableCell align="center">Homerun</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { lineupTeamHome && lineupTeamHome.length > 0 && lineupTeamHome.map((lineup: IMatchLineup) =>{
                          const currentFieldIndex = fields.findIndex((field, index) => field.lineupId === lineup.id)
                          if( currentFieldIndex === -1 ) return '';
                          const currentField = fields[currentFieldIndex];
                          const playerName = getPlayerName(lineup.idPlayer);
                          return (
                          <TableRow key={`row-player-${lineup.id}`}>
                            <TableCell>{playerName}</TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`BO`}
                                controllerName={`playerStats.${currentFieldIndex}.hitOrder`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`AB`}
                                controllerName={`playerStats.${currentFieldIndex}.atBats`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Out`}
                                controllerName={`playerStats.${currentFieldIndex}.out`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SI`}
                                controllerName={`playerStats.${currentFieldIndex}.single`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`DB`}
                                controllerName={`playerStats.${currentFieldIndex}.double`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`TR`}
                                controllerName={`playerStats.${currentFieldIndex}.triple`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`HR`}
                                controllerName={`playerStats.${currentFieldIndex}.homerun`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            
                          </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" component="h3" align="center">
                    {teamAway.name}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Player</TableCell>
                          <TableCell align="center">Bat Order</TableCell>
                          <TableCell align="center">At Bats</TableCell>
                          <TableCell align="center">Out</TableCell>
                          <TableCell align="center">Single</TableCell>
                          <TableCell align="center">Double</TableCell>
                          <TableCell align="center">Triple</TableCell>
                          <TableCell align="center">Homerun</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { lineupTeamAway && lineupTeamAway.length > 0 && lineupTeamAway.map((lineup: IMatchLineup) =>{
                          const currentFieldIndex = fields.findIndex((field, index) => field.lineupId === lineup.id)
                          if( currentFieldIndex === -1 ) return '';
                          const currentField = fields[currentFieldIndex];
                          const playerName = getPlayerName(lineup.idPlayer);
                          return (
                          <TableRow key={`row-player-${lineup.id}`}>
                            <TableCell>{playerName}</TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`BO`}
                                controllerName={`playerStats.${currentFieldIndex}.hitOrder`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`AB`}
                                controllerName={`playerStats.${currentFieldIndex}.atBats`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Out`}
                                controllerName={`playerStats.${currentFieldIndex}.out`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SI`}
                                controllerName={`playerStats.${currentFieldIndex}.single`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`DB`}
                                controllerName={`playerStats.${currentFieldIndex}.double`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`TR`}
                                controllerName={`playerStats.${currentFieldIndex}.triple`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`HR`}
                                controllerName={`playerStats.${currentFieldIndex}.homerun`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            
                          </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>

            <Button 
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              >Confirm</Button>

            { apiSuccess && <Alert security="success">{apiSuccess}</Alert> }
            { apiError && <Alert severity="error">{apiError}</Alert> }
          </FormProvider>
        </Box>
      </Modal>
    </>
  )
}
export default CompleteMatch;