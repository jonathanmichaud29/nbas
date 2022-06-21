import { useState, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Button, Box, CircularProgress, MenuItem, Paper, TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AppDispatch, RootState } from "../redux/store";
import { addMatch } from "../redux/matchSlice";
import { addTeams } from "../redux/teamSlice";
import { createMatch } from '../ApiCall/matches';

import { fetchTeams } from '../ApiCall/teams';
import { ITeam } from '../Interfaces/team';

const defaultValues = {
  teamHome: 0,
  teamAway: 0,
  date: new Date("YYYY-mm-dd 15:00:00")
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
  const [isLoaded, setIsLoaded] = useState(false);

  const listTeams = useSelector((state: RootState) => state.teams )

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, reset, formState: { errors }, watch } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;
    console.log("data send", data);
    setRequestStatus(true);
    reinitializeApiMessages();

    createMatch(data.teamHome, data.teamAway, data.date)
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
    fetchTeams()
      .then(response => {
        dispatch(addTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }, [dispatch])

  return (
    <div>
      <h3>Create new Match</h3>
      <Paper>
        { ! isLoaded && <Box><CircularProgress /></Box>}
        { apiError && <Alert severity="error">{apiError}</Alert> }
        { apiSuccess && <Alert security="success">{apiSuccess}</Alert> }
        <Controller
          name={"teamHome"}
          control={control}
          rules={{ 
            required: "This is required",
            min:{
              value: 1,
              message: "Select a home team"
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextField 
              select
              onChange={onChange} 
              value={value} 
              label="Select Home Team"
              error={errors.teamHome ? true : false}
              helperText={errors.teamHome ? errors.teamHome.message : '' }
            >
              <MenuItem value="0">- Home Team -</MenuItem>
              { listTeams.length > 0 && listTeams.map((team: ITeam) => (
                  <MenuItem key={`home-team-${team.id}`} value={team.id}>{team.name}</MenuItem>
                )
              )}
            </TextField>
          )}
        />

        <Controller
          name={"teamAway"}
          control={control}
          rules={{ 
            required: "This is required",
            min:{
              value: 1,
              message: "Select an away team"
            },
            validate: (myTeam: number) => {
              if( watch('teamHome') === myTeam ) {
                return "Teams should not be the same";
              }
            }
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              select
              onChange={onChange} 
              value={value} 
              label="Select Away Team"
              error={errors.teamAway ? true : false}
              helperText={errors.teamAway ? errors.teamAway.message : '' }
            >
              <MenuItem value="0">- Away Team -</MenuItem>
              { listTeams.length > 0 && listTeams.map((team: ITeam) => (
                  <MenuItem key={`away-team-${team.id}`} value={team.id}>{team.name}</MenuItem>
                )
              )}
            </TextField>
          )}
        />

        <Controller
          name={"date"}
          control={control}
          rules={{ 
            required: "This is required",
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <LocalizationProvider dateAdapter={AdapterDateFns}>

                <DateTimePicker
                  label="Match Date"
                  value={value}
                  onChange={onChange}
                  minutesStep={5}
                  minDate={new Date('2022-05-01')}
                  maxDate={new Date('2022-10-31')}
                  inputFormat="yyyy-MM-dd hh:mm a"
                  disableMaskedInput={true}
                  renderInput={(params:any) => (
                    <TextField 
                      {...params} 
                      error={errors.date ? true : false}
                      helperText={errors.date ? errors.date.message : '' }
                    />
                  )}
                />
              </LocalizationProvider>

            )}
          }
        />

        <Button 
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          >Submit</Button>
      </Paper>
    </div>
  );
}

export default CreateMatch;