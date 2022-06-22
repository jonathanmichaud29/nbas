import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'
import { SubmitHandler, useForm, useFieldArray, FormProvider } from "react-hook-form";

import { Alert, Paper, Button, Box, Grid, Modal, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material"
import HelpIcon from '@mui/icons-material/Help';

import { AppDispatch, RootState } from "../redux/store";

import { fetchMatchLineups, updateMatchLineup } from '../ApiCall/matches';

import { IPlayerLineupStats } from "../Interfaces/stats";
import { ICompleteMatchProps, IMatchLineup, IMatchPlayers } from '../Interfaces/match'

import FormNumberInput from '../Forms/FormNumberInput';

import { castNumber } from '../utils/castValues';
import styleModalLarge from './styleModalLarge'
import { addMatchPlayers } from "../redux/matchPlayerSlice";

import { getPlayerName } from '../utils/dataAssociation';

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
  const dispatch = useDispatch<AppDispatch>();
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
  const { handleSubmit, control, setValue } = methods;
  const { fields, append, remove } = useFieldArray(
    { control, name: "playerStats" }
  );

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
      hitByPitch: lineupPlayer.hitByPitch,
      walk: lineupPlayer.walk,
      strikeOut: lineupPlayer.strikeOut,
      stolenBase: lineupPlayer.stolenBase,
      caughtStealing: lineupPlayer.caughtStealing,
      plateAppearance: lineupPlayer.plateAppearance,
      sacrificeBunt: lineupPlayer.sacrificeBunt,
      sacrificeFly: lineupPlayer.sacrificeFly,
      runsBattedIn: lineupPlayer.runsBattedIn,
      hit: lineupPlayer.hit,
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
      hitByPitch: lineupPlayer.hitByPitch,
      walk: lineupPlayer.walk,
      strikeOut: lineupPlayer.strikeOut,
      stolenBase: lineupPlayer.stolenBase,
      caughtStealing: lineupPlayer.caughtStealing,
      plateAppearance: lineupPlayer.plateAppearance,
      sacrificeBunt: lineupPlayer.sacrificeBunt,
      sacrificeFly: lineupPlayer.sacrificeFly,
      runsBattedIn: lineupPlayer.runsBattedIn,
      hit: lineupPlayer.hit,
    }));
  }, [allMatchPlayers, teamHome, teamAway, setValue, append, remove]);

  /**
   * Form behaviors
   */
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;
    
    setRequestStatus(true);
    reinitializeApiMessages();

    let updatedMatch = Object.assign({},match);
    updatedMatch.isCompleted = 1;
    updatedMatch.teamHomePoints = data.teamHomePoints;
    updatedMatch.teamAwayPoints = data.teamAwayPoints;
    
    // Cast possible string values to numbers
    const formattedPlayerStats = data.playerStats.map((lineup: IPlayerLineupStats) => {
      return {
        hitOrder:         castNumber(lineup.hitOrder),
        atBats:           castNumber(lineup.atBats),
        single:           castNumber(lineup.single),
        double:           castNumber(lineup.double),
        triple:           castNumber(lineup.triple),
        homerun:          castNumber(lineup.homerun),
        lineupId:         castNumber(lineup.lineupId),
        out:              castNumber(lineup.out),
        hitByPitch:       castNumber(lineup.hitByPitch),
        walk:             castNumber(lineup.walk),
        strikeOut:        castNumber(lineup.strikeOut),
        stolenBase:       castNumber(lineup.stolenBase),
        caughtStealing:   castNumber(lineup.caughtStealing),
        plateAppearance:  castNumber(lineup.plateAppearance),
        sacrificeBunt:    castNumber(lineup.sacrificeBunt),
        sacrificeFly:     castNumber(lineup.sacrificeFly),
        runsBattedIn:     castNumber(lineup.runsBattedIn),
        hit:              castNumber(lineup.hit),
      }
    })

    updateMatchLineup(updatedMatch, formattedPlayerStats)
      .then((response) =>{
        changeApiSuccess(response.message);
        fetchMatchLineups(match.id)
          .then((response) => {
            dispatch(addMatchPlayers(updatedMatch, response.data))
          })
          .finally(() => {
            handleModalClose()
          })
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
        <Box sx={styleModalLarge}>
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
                          <TableCell align="center">
                            <span>Bat Order</span>
                            <Tooltip title="Batting Order during a match."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Plate Appearance</span>
                            <Tooltip title="The number of times a player has taken his turn at bat."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>At Bats</span>
                            <Tooltip title="Trips to the plate that do not result in a walk, hit by pitch, sacrifice, or reach on interference."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Hit Out</span>
                            <Tooltip title="When a batter does not make a safe hit. "><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Strike Out</span>
                            <Tooltip title="When the umpire calls three strikes on the batter."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Walk</span>
                            <Tooltip title="When a batter is awarded first base after four balls have been called by the umpire or the opposing team opts to intentionally award the batter first base."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Hits</span>
                            <Tooltip title="When a batter reaches base safely on a fair ball unless the batter is deemed by the official scorer to have reached on an error or a fielder's choice."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Single</span>
                            <Tooltip title="When a batter reaches base safely on a fair ball unless the batter is deemed by the official scorer to have reached on an error or a fielder's choice."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Double</span>
                            <Tooltip title="When a batter reaches on a hit and stops at second base or only advances farther than second base on an error or a fielder's attempt to put out another baserunner."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Triple</span>
                            <Tooltip title="When a batter reaches on a hit and stops at third base or only advances farther than third base on an error or a fielder's attempt to put out another baserunner."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Homerun</span>
                            <Tooltip title="When a batter reaches on a hit, touches all bases, and scores a run without a putout recorded or the benefit of error"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Runs Batted In</span>
                            <Tooltip title="Runs which score because of the batter's safe hit, sac bunt, sac fly, infield out or fielder's choice or is forced to score by a bases loaded walk, hit batter, or interference"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Sacrifice Bunt</span>
                            <Tooltip title="When a batter advances one or more runners at least one base with a bunt"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Sacrifice Fly</span>
                            <Tooltip title="When a batter hits a fly ball to the outfield that is caught and a runner scores"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Stolen Base</span>
                            <Tooltip title="When the runner advances one base unaided by a hit, a putout, an error, a force-out, a fielder's choice, a passed ball, a wild pitch or a walk"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Caught Stealing</span>
                            <Tooltip title="When a runner attemps to steal but is tagged out before safely attaining the next base"><HelpIcon /></Tooltip>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { lineupTeamHome && lineupTeamHome.length > 0 && lineupTeamHome.map((lineup: IMatchLineup) =>{
                          const currentFieldIndex = fields.findIndex((field, index) => field.lineupId === lineup.id)
                          if( currentFieldIndex === -1 ) return '';
                          const currentField = fields[currentFieldIndex];
                          const playerName = getPlayerName(lineup.idPlayer, allPlayers);
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
                                label={`PA`}
                                controllerName={`playerStats.${currentFieldIndex}.plateAppearance`}
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
                                label={`Hit Out`}
                                controllerName={`playerStats.${currentFieldIndex}.out`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Strike Out`}
                                controllerName={`playerStats.${currentFieldIndex}.strikeOut`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Walk`}
                                controllerName={`playerStats.${currentFieldIndex}.walk`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Hit`}
                                controllerName={`playerStats.${currentFieldIndex}.hit`}
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
                            <TableCell>
                              <FormNumberInput
                                label={`RBI`}
                                controllerName={`playerStats.${currentFieldIndex}.runsBattedIn`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SAC`}
                                controllerName={`playerStats.${currentFieldIndex}.sacrificeBunt`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SF`}
                                controllerName={`playerStats.${currentFieldIndex}.sacrificeFly`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SB`}
                                controllerName={`playerStats.${currentFieldIndex}.stolenBase`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`HR`}
                                controllerName={`playerStats.${currentFieldIndex}.caughtStealing`}
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
                          <TableCell align="center">
                            <span>Bat Order</span>
                            <Tooltip title="Batting Order during a match."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Plate Appearance</span>
                            <Tooltip title="The number of times a player has taken his turn at bat."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>At Bats</span>
                            <Tooltip title="Trips to the plate that do not result in a walk, hit by pitch, sacrifice, or reach on interference."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Hit Out</span>
                            <Tooltip title="When a batter does not make a safe hit. "><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Strike Out</span>
                            <Tooltip title="When the umpire calls three strikes on the batter."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Walk</span>
                            <Tooltip title="When a batter is awarded first base after four balls have been called by the umpire or the opposing team opts to intentionally award the batter first base."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Hits</span>
                            <Tooltip title="When a batter reaches base safely on a fair ball unless the batter is deemed by the official scorer to have reached on an error or a fielder's choice."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Single</span>
                            <Tooltip title="When a batter reaches base safely on a fair ball unless the batter is deemed by the official scorer to have reached on an error or a fielder's choice."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Double</span>
                            <Tooltip title="When a batter reaches on a hit and stops at second base or only advances farther than second base on an error or a fielder's attempt to put out another baserunner."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Triple</span>
                            <Tooltip title="When a batter reaches on a hit and stops at third base or only advances farther than third base on an error or a fielder's attempt to put out another baserunner."><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Homerun</span>
                            <Tooltip title="When a batter reaches on a hit, touches all bases, and scores a run without a putout recorded or the benefit of error"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Runs Batted In</span>
                            <Tooltip title="Runs which score because of the batter's safe hit, sac bunt, sac fly, infield out or fielder's choice or is forced to score by a bases loaded walk, hit batter, or interference"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Sacrifice Bunt</span>
                            <Tooltip title="When a batter advances one or more runners at least one base with a bunt"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Sacrifice Fly</span>
                            <Tooltip title="When a batter hits a fly ball to the outfield that is caught and a runner scores"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Stolen Base</span>
                            <Tooltip title="When the runner advances one base unaided by a hit, a putout, an error, a force-out, a fielder's choice, a passed ball, a wild pitch or a walk"><HelpIcon /></Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <span>Caught Stealing</span>
                            <Tooltip title="When a runner attemps to steal but is tagged out before safely attaining the next base"><HelpIcon /></Tooltip>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { lineupTeamAway && lineupTeamAway.length > 0 && lineupTeamAway.map((lineup: IMatchLineup) =>{
                          const currentFieldIndex = fields.findIndex((field, index) => field.lineupId === lineup.id)
                          if( currentFieldIndex === -1 ) return '';
                          const currentField = fields[currentFieldIndex];
                          const playerName = getPlayerName(lineup.idPlayer, allPlayers);
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
                                label={`PA`}
                                controllerName={`playerStats.${currentFieldIndex}.plateAppearance`}
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
                                label={`Hit Out`}
                                controllerName={`playerStats.${currentFieldIndex}.out`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Strike Out`}
                                controllerName={`playerStats.${currentFieldIndex}.strikeOut`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Walk`}
                                controllerName={`playerStats.${currentFieldIndex}.walk`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`Hit`}
                                controllerName={`playerStats.${currentFieldIndex}.hit`}
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
                            <TableCell>
                              <FormNumberInput
                                label={`RBI`}
                                controllerName={`playerStats.${currentFieldIndex}.runsBattedIn`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SAC`}
                                controllerName={`playerStats.${currentFieldIndex}.sacrificeBunt`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SF`}
                                controllerName={`playerStats.${currentFieldIndex}.sacrificeFly`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`SB`}
                                controllerName={`playerStats.${currentFieldIndex}.stolenBase`}
                                controllerKey={currentField.id}
                                fieldMinValue={0}
                                isRequired={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FormNumberInput
                                label={`HR`}
                                controllerName={`playerStats.${currentFieldIndex}.caughtStealing`}
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