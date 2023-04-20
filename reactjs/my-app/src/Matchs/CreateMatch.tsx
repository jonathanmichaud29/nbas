import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button, Box, CircularProgress, Stack, Typography, Paper } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { addMatch } from "../redux/matchSlice";

import { createMatch, IApiCreateMatchParams } from '../ApiCall/matches';

import FormSelect from '../Forms/FormSelect';
import FormDateTimePicker from '../Forms/FormDateTimePicker';
import LoaderInfo from '../Generic/LoaderInfo';

import { filterTeamsBySeason } from '../utils/dataFilter';


const dateNow = new Date();
const defaultValues = {
  teamHome: 0,
  teamAway: 0,
  date: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 15, 0)
}

interface IFormInput {
  teamHome: number;
  teamAway: number;
  date: Date;
}



function CreateMatch() {
  const dispatch = useDispatch<AppDispatch>();

  const stateAdminContext = useSelector((state: RootState) => state.adminContext )
  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )
  const listTeamSeasons = useSelector((state: RootState) => state.teamSeasons )

  const currentLeagueName = stateAdminContext.currentLeague?.name || '';

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);
  
  const filteredTeams = filterTeamsBySeason(listTeams, listLeagueTeams, listTeamSeasons, stateAdminContext.currentLeagueSeason);
  filteredTeams.sort((a, b) => a.name.localeCompare(b.name));
  
  const teamOptions = filteredTeams.map((team) => {
    return {
      value:team.id, 
      label:team.name
    }
  })

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const [customDateError, setCustomDateError] = useState<boolean>(false);
  const cbSetDateError=(error?: string) => {
    setCustomDateError(!!error);
    
    if( !!error ){
      setError("date", {
        type: 'manual',
        message:error
      }, {shouldFocus:true});
    }
    else {
      clearErrors("date");
    }
  }

  
  /**
   * 
   */
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset, watch, setError, clearErrors } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus || customDateError ) return;
    
    setRequestStatus(true);
    reinitializeApiMessages();

    const paramsCreateMatch: IApiCreateMatchParams = {
      teamHomeId: data.teamHome,
      teamAwayId: data.teamAway,
      date: data.date
    }
    createMatch(paramsCreateMatch)
      .then((response) =>{
        reset()
        changeApiSuccess(response.message);
        dispatch(addMatch(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setRequestStatus(false);
      })
      
  }

  return (
    
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h1">{currentLeagueName} Matches</Typography>
        <Typography variant="subtitle1">Add new match to calendar</Typography>
        <LoaderInfo
          msgError={apiError}
          msgSuccess={apiSuccess}
        />

        <FormProvider {...methods}>
          <Stack spacing={3} alignItems="center">
            <FormSelect
              label='Home team'
              controllerName='teamHome'
              isRequired={true}
              fieldMinValue={1}
              fieldMinValueMessage={`Select an home team`}
              options={teamOptions}
              optionKeyPrefix={`home-team-`}
              defaultOptions={[{
                value: 0,
                label: "-- Home Team --"
              }]}
            />
            <FormSelect
              label='Away team'
              controllerName='teamAway'
              isRequired={true}
              fieldMinValue={1}
              fieldMinValueMessage={`Select an away team`}
              options={teamOptions}
              optionKeyPrefix={`away-team-`}
              defaultOptions={[{
                value: 0,
                label: "-- Away Team --"
              }]}
              validateWatchNumber={(value: number) => {
                if( watch('teamHome') === value ) {
                  return "Teams should not be the same";
                }
              }}
            />
            <FormDateTimePicker
              label="Match Date"
              callbackError={cbSetDateError}
              controllerName='date'
              isRequired={true}
              inputFormat={"yyyy-MM-dd hh:mm a"}
              minutesStep={5}
              // minDate={new Date('2022-05-01')} // TODO: We should get Season first date
              // maxDate={new Date('2022-10-31')} // TODO: We should get Season last date
            />
            <Button 
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={requestStatus}
              startIcon={requestStatus && (
                <CircularProgress size={14}/>
              )}
              >{requestStatus ? 'Request Sent' : 'Create match'}</Button>

            
          </Stack>
        </FormProvider>
      </Stack>
    </Paper>
  );
}

export default CreateMatch;