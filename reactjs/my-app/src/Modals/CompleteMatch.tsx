import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'
import { SubmitHandler, useForm, useFieldArray, FormProvider, Controller } from "react-hook-form";

import { Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Stack, IconButton, Box, Tooltip, Accordion, AccordionSummary, AccordionDetails, TextField, CircularProgress } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { AppDispatch, RootState } from "../redux/store";
import { addMatchPlayers } from "../redux/matchPlayerSlice";

import { fetchMatchLineups, IApiFetchMatchLineups, IApiUpdateMatchLineupParams, updateMatchLineup } from '../ApiCall/matches';

import { IPlayerLineupStats } from "../Interfaces/stats";
import { ICompleteMatchProps, IMatchLineup, EBatResult, batResultOptions, IPlayerBatResult } from '../Interfaces/match'

import FormNumberInput from '../Forms/FormNumberInput';

import { getPlayerName } from '../utils/dataAssociation';
import { castNumber } from '../utils/castValues';
import LoaderInfo from "../Generic/LoaderInfo";

import { ITeam } from "../Interfaces/team";
import { groupBatResultsPerLineup } from "../utils/statsAggregation";
import FormSelect from "../Forms/FormSelect";





interface IFormInput {
  teamHomePoints: number;
  teamAwayPoints: number;
  playerStats: IPlayerLineupStats[];
  playerBatResults: IPlayerBatResult[];
}
const defaultValues = {
  teamHomePoints: 0,
  teamAwayPoints: 0,
  playerStats: [],
  playerBatResults:[]
}
function CompleteMatch(props: ICompleteMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {isOpen, match, teamHome, teamAway, callbackCloseModal, allPlayers} = props;
  
  /**
   * Set States
   */
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);

  const [nbAppearancesHome, setNbAppearancesHome] = useState<number>(4);
  const [nbAppearancesAway, setNbAppearancesAway] = useState<number>(4);

  const [lineupTeamHome, setLineupTeamHome] = useState<IMatchLineup[] | null>(null);
  const [lineupTeamAway, setLineupTeamAway] = useState<IMatchLineup[] | null>(null);

  const selectCurrentMatchPlayers = createSelector(
    (state: RootState) => state.matchPlayers,
    (matchPlayers) => matchPlayers.find((matchPlayer) => matchPlayer.match.id === match.id)
  )
  const allMatchPlayers = useSelector(selectCurrentMatchPlayers) || null;

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, setValue } = methods;
  

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
    fieldsPlayerStatsRemove();
    fieldsBatResultRemove();
    
    teamHomePlayers.forEach((lineupPlayer: IMatchLineup) => {
      fieldsPlayerStatsAppend({
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
      })
      generateFieldsBatResult(lineupPlayer);
    });
    
    teamAwayPlayers.forEach((lineupPlayer: IMatchLineup) => {
      fieldsPlayerStatsAppend({
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
      })
      generateFieldsBatResult(lineupPlayer);
    });
  }, [allMatchPlayers, teamHome, teamAway, setValue]);


  /**
   * Dynamic fields
   */
  const {
    fields: fieldsPlayerStats,
    append: fieldsPlayerStatsAppend,
    remove: fieldsPlayerStatsRemove,
  } = useFieldArray(
    { control, name: "playerStats" }
  );
  const {
    fields: fieldsBatResult,
    append: fieldsBatResultAppend,
    remove: fieldsBatResultRemove,
  } = useFieldArray(
    { control, name: "playerBatResults" }
  );
  
  const generateFieldsBatResult = (matchLineup: IMatchLineup) => {
    if( matchLineup.single > 0) {
      for(let i=0;i<matchLineup.single;i++) 
        addPlayerBatResult(matchLineup, EBatResult.single)
    }
    if( matchLineup.double > 0) {
      for(let i=0;i<matchLineup.double;i++) 
        addPlayerBatResult(matchLineup, EBatResult.double)
    }
    if( matchLineup.triple > 0) {
      for(let i=0;i<matchLineup.triple;i++) 
        addPlayerBatResult(matchLineup, EBatResult.triple)
    }
    if( matchLineup.homerun > 0) {
      for(let i=0;i<matchLineup.homerun;i++) 
        addPlayerBatResult(matchLineup, EBatResult.homerun)
    }
    if( matchLineup.hitByPitch > 0) {
      for(let i=0;i<matchLineup.hitByPitch;i++) 
        addPlayerBatResult(matchLineup, EBatResult.hitByPitch)
    }
    if( matchLineup.walk > 0) {
      for(let i=0;i<matchLineup.walk;i++) 
        addPlayerBatResult(matchLineup, EBatResult.walk)
    }
    if( matchLineup.out > 0) {
      for(let i=0;i<matchLineup.out;i++) 
        addPlayerBatResult(matchLineup, EBatResult.out)
    }
    if( matchLineup.strikeOut > 0) {
      for(let i=0;i<matchLineup.strikeOut;i++) 
        addPlayerBatResult(matchLineup, EBatResult.strikeOut)
    }
    if( matchLineup.sacrificeBunt > 0) {
      for(let i=0;i<matchLineup.sacrificeBunt;i++) 
        addPlayerBatResult(matchLineup, EBatResult.sacrificeBunt)
    }
    if( matchLineup.sacrificeFly > 0) {
      for(let i=0;i<matchLineup.sacrificeFly;i++) 
        addPlayerBatResult(matchLineup, EBatResult.sacrificeFly)
    }
    
  }
  const addTeamBatResults = (team: ITeam) => {
    const teamPlayers = allMatchPlayers?.lineupPlayers.filter((lineupPlayer: IMatchLineup) => lineupPlayer.idTeam === team.id )
    const nbRequiredResults = team.id === teamHome.id ? nbAppearancesHome : nbAppearancesAway;
    teamPlayers && teamPlayers.every((lineupPlayer: IMatchLineup) => {
      const nbAppearances = fieldsBatResult.filter((fieldBatResult) => fieldBatResult.lineupId === lineupPlayer.id).length;
      const nbNewBatResults = nbRequiredResults - nbAppearances;
      if( nbNewBatResults > 0 ){
        for(var i=0;i<nbNewBatResults;i++){
          fieldsBatResultAppend({
            lineupId: lineupPlayer.id,
            batResults:EBatResult.none
          })
        }
      }
      return true;
    })
  }
  const addPlayerBatResult = (lineup: IMatchLineup, batResult?:EBatResult) => {
    fieldsBatResultAppend({
      lineupId: lineup.id,
      batResults: batResult ? batResult : EBatResult.none
    })
  }
  const removePlayerBatResult = (index:number) => {
    fieldsBatResultRemove(index);
  }


  /**
   * Form behaviors
   */
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;
    
    /* setRequestStatus(true); */
    reinitializeApiMessages();

    let updatedMatch = Object.assign({},match);
    updatedMatch.isCompleted = 1;
    updatedMatch.teamHomePoints = data.teamHomePoints;
    updatedMatch.teamAwayPoints = data.teamAwayPoints;

    const combinedLineupStats: IPlayerLineupStats[] = groupBatResultsPerLineup(data.playerBatResults);
    
    const formattedPlayerStats = data.playerStats.map((lineup: IPlayerLineupStats) => {
      const combinedLineupStat = combinedLineupStats.find((combinedLineupStat: IPlayerLineupStats) => combinedLineupStat.lineupId === lineup.lineupId);
      return {
        hitOrder:         castNumber(lineup.hitOrder),
        atBats:           castNumber(combinedLineupStat?.atBats),
        single:           castNumber(combinedLineupStat?.single),
        double:           castNumber(combinedLineupStat?.double),
        triple:           castNumber(combinedLineupStat?.triple),
        homerun:          castNumber(combinedLineupStat?.homerun),
        lineupId:         castNumber(lineup.lineupId),
        out:              castNumber(combinedLineupStat?.out),
        hitByPitch:       castNumber(combinedLineupStat?.hitByPitch),
        walk:             castNumber(combinedLineupStat?.walk),
        strikeOut:        castNumber(combinedLineupStat?.strikeOut),
        stolenBase:       castNumber(lineup.stolenBase),
        caughtStealing:   castNumber(lineup.caughtStealing),
        plateAppearance:  castNumber(combinedLineupStat?.plateAppearance),
        sacrificeBunt:    castNumber(combinedLineupStat?.sacrificeBunt),
        sacrificeFly:     castNumber(combinedLineupStat?.sacrificeFly),
        runsBattedIn:     castNumber(lineup.runsBattedIn),
        hit:              castNumber(combinedLineupStat?.hit),
      }
    })
    

    
    const paramsUpdateMatchLineup: IApiUpdateMatchLineupParams = {
      match: updatedMatch,
      playersLineupsStats: formattedPlayerStats
    }
    updateMatchLineup(paramsUpdateMatchLineup)
      .then((response) =>{
        changeApiSuccess(response.message);
        
        const paramsMatchLineups: IApiFetchMatchLineups = {
          matchId: match.id
        }
        fetchMatchLineups(paramsMatchLineups)
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
    <Dialog
      open={isModalOpen}
      fullScreen
    >
      <DialogTitle textAlign="center">Complete Match #<b>{match.id}</b></DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <Stack pt={1} pb={1} spacing={3}>
            <LoaderInfo
              msgError={apiError}
              msgSuccess={apiSuccess}
            />
            <Grid container spacing={2} justifyContent="center" >
              <Grid item xs={12} sm={6} md={3}>
                <FormNumberInput
                  label={`${teamHome.name} Points`}
                  controllerName={`teamHomePoints`}
                  fieldMinValue={0}
                  isRequired={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormNumberInput
                  label={`${teamAway.name} Points`}
                  controllerName={`teamAwayPoints`}
                  fieldMinValue={0}
                  isRequired={true}
                />
              </Grid>
            </Grid>

            <Typography variant="h4" align="center">{teamHome.name}</Typography>
            <Stack flexDirection={{xs:"column", sm:"row"}}>
              <TextField 
                size="small"
                onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                  setNbAppearancesHome(castNumber(event.target.value))
                }} 
                value={nbAppearancesHome}
                type="number"
                label="Required Appereances"
              />
              <Button color="primary"
                onClick={()=>addTeamBatResults(teamHome)}
                startIcon={<AddCircleIcon />}
              >Add Bat results for team players</Button>
            </Stack>

            { lineupTeamHome && lineupTeamHome.length > 0 && lineupTeamHome.map((lineup: IMatchLineup) =>{
              const playerName = getPlayerName(lineup.idPlayer, allPlayers);
              const currentFieldPlayerIndex = fieldsPlayerStats.findIndex((field) => field.lineupId === lineup.id)
              if( currentFieldPlayerIndex === -1 ) return '';
              const currentFieldPlayer = fieldsPlayerStats[currentFieldPlayerIndex];
              return (
                <Accordion key={`player-row-${lineup.id}`}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      '&:hover':{
                        backgroundColor:"#f1f1f1"
                      }
                    }}
                  >
                    <Typography variant="h6">{playerName}</Typography>
                  </AccordionSummary>
                
                  <AccordionDetails>
                    <Grid container >
                      <Grid item sm={12} md={6} lg={8}>
                        <Grid container justifyContent="space-between" alignItems="flex-start" mb={3} spacing={1}>
                          <Grid item xs={12} pb={1}>
                            <Button 
                              variant="contained"
                              startIcon={<AddCircleIcon />}
                              onClick={()=>addPlayerBatResult(lineup)}
                            >Bat Result</Button>
                          </Grid>

                          { fieldsBatResult && fieldsBatResult.map((batResult, index) => {
                            if( batResult.lineupId !== lineup.id) return '';
                            return (
                              <Grid item xs={12} sm  key={`bat-result-${index}`} pb={1}>
                                <Box sx={{
                                  whiteSpace:"nowrap",
                                  '&:hover .MuiButtonBase-root, &:hover .MuiOutlinedInput-root':{
                                    backgroundColor:'#f4f4f4'
                                  }
                                }}>
                                  <Tooltip title="Delete Bat Result">
                                    <IconButton
                                      onClick={()=>removePlayerBatResult(index)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <FormSelect
                                    controllerName={`playerBatResults.${index}.batResults`}
                                    label={`Bat Result`}
                                    options={batResultOptions}
                                    optionKeyPrefix={`bat-result-${index}-`}
                                    fieldValueIsNot={EBatResult.none}
                                    fieldValueIsNotMessage="An option is required"
                                  />
                                  
                                </Box>
                              </Grid>
                            )
                          })}
                        </Grid>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <Grid container p={1} spacing={3} alignItems="center" justifyContent="flex-start">
                          <Grid item xs={12}>
                            <Typography variant="h6">Global match stats</Typography>
                          </Grid>
                          <Grid item xs={12} sm >
                            <FormNumberInput
                              label={`Hit Order`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.hitOrder`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormNumberInput
                              label={`Runs Batted In`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.runsBattedIn`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}
                            
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormNumberInput
                              label={`Stolen Base`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.stolenBase`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}  
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormNumberInput
                              label={`Caught Stealing`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.caughtStealing`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )
            })}


            <Typography variant="h4" align="center">{teamAway.name}</Typography>
            <Stack flexDirection={{xs:"column", sm:"row"}}>
              <TextField 
                size="small"
                onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                  setNbAppearancesAway(castNumber(event.target.value))
                }} 
                value={nbAppearancesAway}
                type="number"
                label="Required Appereances"
              />
              <Button color="primary"
                onClick={()=>addTeamBatResults(teamAway)}
                startIcon={<AddCircleIcon />}
              >Add Bat results for team players</Button>
            </Stack>

            { lineupTeamAway && lineupTeamAway.length > 0 && lineupTeamAway.map((lineup: IMatchLineup) =>{
              const playerName = getPlayerName(lineup.idPlayer, allPlayers);
              const currentFieldPlayerIndex = fieldsPlayerStats.findIndex((field) => field.lineupId === lineup.id)
              if( currentFieldPlayerIndex === -1 ) return '';
              const currentFieldPlayer = fieldsPlayerStats[currentFieldPlayerIndex];
              return (
                <Accordion key={`player-row-${lineup.id}`}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      '&:hover':{
                        backgroundColor:"#f1f1f1"
                      }
                    }}
                  >
                    <Typography variant="h6">{playerName}</Typography>
                  </AccordionSummary>
                
                  <AccordionDetails>
                    <Grid container >
                      <Grid item sm={12} md={6} lg={8}>
                        <Grid container justifyContent="space-between" alignItems="flex-start" mb={3} spacing={1}>
                          <Grid item xs={12} pb={1}>
                            <Button 
                              variant="contained"
                              startIcon={<AddCircleIcon />}
                              onClick={()=>addPlayerBatResult(lineup)}
                            >Bat Result</Button>
                          </Grid>

                          { fieldsBatResult && fieldsBatResult.map((batResult, index) => {
                            if( batResult.lineupId !== lineup.id) return '';
                            return (
                            
                              <Grid item xs={12} sm  key={`bat-result-${index}`} pb={1} pl={1}>
                                <Box sx={{
                                  whiteSpace:"nowrap",
                                  '&:hover .MuiButtonBase-root, &:hover .MuiOutlinedInput-root':{
                                    backgroundColor:'#f4f4f4'
                                  }
                                }}>
                                  <Tooltip title="Delete Bat Result">
                                    <IconButton
                                      onClick={()=>removePlayerBatResult(index)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <FormSelect
                                    controllerName={`playerBatResults.${index}.batResults`}
                                    label={`Bat Result`}
                                    options={batResultOptions}
                                    optionKeyPrefix={`bat-result-${index}-`}
                                    fieldValueIsNot={EBatResult.none}
                                    fieldValueIsNotMessage="An option is required"
                                  />
                                  
                                </Box>
                              </Grid>
                            )
                          })}
                        </Grid>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <Grid container p={1} spacing={3} alignItems="center" justifyContent="flex-start">
                          <Grid item xs={12}>
                            <Typography variant="h6">Global match stats</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} >
                            <FormNumberInput
                              label={`Hit Order`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.hitOrder`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormNumberInput
                              label={`Runs Batted In`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.runsBattedIn`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}
                            
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormNumberInput
                              label={`Stolen Base`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.stolenBase`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}  
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormNumberInput
                              label={`Caught Stealing`}
                              controllerName={`playerStats.${currentFieldPlayerIndex}.caughtStealing`}
                              controllerKey={currentFieldPlayer.id}
                              fieldMinValue={0}
                              isRequired={true}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Stack>
        </FormProvider>
      </DialogContent>
      
      <DialogActions>
        <Stack spacing={1} rowGap={1} alignItems="center" justifyContent="center" direction="row" flexWrap="wrap">
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={requestStatus}
            startIcon={requestStatus && (
              <CircularProgress size={14}/>
            )}
          >{requestStatus ? 'Request Sent' : 'Save Stats'}</Button>
          <Button
            onClick={handleModalClose}
            variant="outlined"
          >Close</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
export default CompleteMatch;