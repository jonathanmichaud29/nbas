import { useState, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addMatch } from "../redux/matchSlice";
import { addTeams } from "../redux/teamSlice";
import { addLeagueTeams } from '../redux/leagueTeamSlice';

import { Alert, Button, Box, CircularProgress, Grid } from "@mui/material";

import { ITeam } from '../Interfaces/team';

import { createMatch, IApiCreateMatchParams } from '../ApiCall/matches';
import { fetchLeagueTeams, fetchTeams, IApiFetchLeagueTeamsParams, IApiFetchTeamsParams } from '../ApiCall/teams';

import FormSelect from '../Forms/FormSelect';
import FormDateTimePicker from '../Forms/FormDateTimePicker';


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
  
  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);
  const [isLeagueTeamsLoaded, setIsLeagueTeamsLoaded] = useState(false);
  const [isTeamsLoaded, setIsTeamsLoaded] = useState(false);
  
  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )

  const isLoaded = isLeagueTeamsLoaded && isTeamsLoaded;

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

  useEffect(() => {
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        dispatch(addLeagueTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLeagueTeamsLoaded(true);
      });
  }, [dispatch]);

  useEffect(() => {
    if( ! isLeagueTeamsLoaded || isTeamsLoaded ) return;

    const teamIds = listLeagueTeams.map((leagueTeam) => leagueTeam.idTeam);
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: teamIds
    }

    fetchTeams(paramsFetchTeams)
      .then(response => {
        dispatch(addTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsTeamsLoaded(true)
      });
  }, [dispatch, isLeagueTeamsLoaded, isTeamsLoaded, listLeagueTeams])

  return (
    <FormProvider {...methods}>
      <Grid container direction="column" flexWrap="nowrap" alignItems="center">
        { ! isLoaded && (
          <Grid item pb={3}><Box><CircularProgress /></Box></Grid>
        )}
        { apiError && (
          <Grid item pb={3}><Alert severity="error">{apiError}</Alert></Grid> 
        )}
        { apiSuccess && (
          <Grid item pb={3}><Alert severity="success">{apiSuccess}</Alert></Grid>
        )}
        <Grid item pb={3}>
          <FormSelect
            label='Home team'
            controllerName='teamHome'
            isRequired={true}
            fieldMinValue={1}
            fieldMinValueMessage={`Select an home team`}
            options={listTeams.map((team: ITeam)=> {
              return {
                value:team.id, 
                label:team.name
              }
            })}
            optionKeyPrefix={`home-team-`}
            defaultOptions={[{
              value: 0,
              label: "-- Home Team --"
            }]}
          />
        </Grid>

        <Grid item pb={3}>
          <FormSelect
            label='Away team'
            controllerName='teamAway'
            isRequired={true}
            fieldMinValue={1}
            fieldMinValueMessage={`Select an away team`}
            options={listTeams.map((team: ITeam)=> {
              return {
                value:team.id, 
                label:team.name
              }
            })}
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
        </Grid>
              
        <Grid item pb={3}>
          <FormDateTimePicker
            label="Match Date"
            callbackError={cbSetDateError}
            controllerName='date'
            isRequired={true}
            inputFormat={"yyyy-MM-dd hh:mm a"}
            minutesStep={5}
            minDate={new Date('2022-05-01')} // TODO: We should get Season first date
            maxDate={new Date('2022-10-31')} // TODO: We should get Season last date
          />
        </Grid>

        <Grid item>
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            >Create match</Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default CreateMatch;