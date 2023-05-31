import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { batch, useDispatch } from "react-redux";

import { Paper, Box, Stack, Typography, Button, CircularProgress } from "@mui/material";

import { AppDispatch } from "../redux/store";
import { addLeague } from "../redux/leagueSlice";
import { addLeagueSeason } from "../redux/leagueSeasonSlice";
import { addAdminLeagues, addAdminLeagueSeasons } from "../redux/adminContextSlice";

import { ILeague, ILeagueSeason } from "../Interfaces/league";

import { createLeague, IApiCreateLeagueParams } from "../ApiCall/leagues";

import FormTextInput from "../Forms/FormTextInput";
import FormNumberInput from "../Forms/FormNumberInput";
import LoaderInfo from "../Generic/LoaderInfo";

import { castNumber } from "../utils/castValues";


interface IFormInput {
  leagueName: string;
  seasonName: string;
  seasonYear: number;
}

export default function CreateLeague(){
  const dispatch = useDispatch<AppDispatch>();

  const [apiInfo, changeApiInfo] = useState<string>("");
  const [apiError, changeApiError] = useState<string>("");
  const [apiWarning, changeApiWarning] = useState<string>("");
  const [apiSuccess, changeApiSuccess] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<boolean>(false);

  const reinitializeApiMessages = () => {
    changeApiInfo('');
    changeApiError('');
    changeApiWarning('');
    changeApiSuccess('');
  }

  const currentYear = new Date().getFullYear();

  const defaultValues = {
    leagueName: "",
    seasonName: "",
    seasonYear: castNumber(currentYear)
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;

    let newLeague: ILeague;
    let newLeagueSeason: ILeagueSeason;
    let newError: string = '';
    let newSuccess: string = '';

    setRequestStatus(true);
    reinitializeApiMessages();
    
    const paramsCreateLeague: IApiCreateLeagueParams = {
      leagueName: data.leagueName,
      seasonName: data.seasonName,
      seasonYear: data.seasonYear
    }
    createLeague(paramsCreateLeague)
      .then((response) =>{
        reset()
        newLeague = {
          id: response.data.leagueId,
          name: response.data.leagueName
        };
        newLeagueSeason = {
          id: response.data.seasonId,
          idLeague: response.data.leagueId,
          name: response.data.seasonName,
          year: response.data.seasonYear,
        };
        newSuccess = response.message;
        
      })
      .catch(error => {
        newError = error;
      })
      .finally(() => {
        batch(() => {
          if( newLeague && newLeagueSeason ){
            dispatch(addLeague(newLeague));
            dispatch(addLeagueSeason(newLeagueSeason));
            dispatch(addAdminLeagues([newLeague]));
            dispatch(addAdminLeagueSeasons([newLeagueSeason]));
          }
          changeApiError(newError);
          changeApiSuccess(newSuccess);
          setRequestStatus(false);
        })
        
      })
      
  }

  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">Create new league</Typography>
        <LoaderInfo
          msgError={apiError}
          msgWarning={apiWarning}
          msgInfo={apiInfo}
          msgSuccess={apiSuccess}
        />
        <FormProvider {...methods}>
          <Stack spacing={1} alignItems="center">
            <FormTextInput
              label={`League name`}
              controllerName={`leagueName`}
              type="text"
              isRequired={true}
            />
            <FormTextInput
              label={`Season Name`}
              controllerName={`seasonName`}
              type="text"
              isRequired={true}
            />
            <FormNumberInput
              label={`Season Year`}
              controllerName={`seasonYear`}
              isRequired={true}
              fieldMinValue={currentYear}
              fieldMaxValue={currentYear+1}
            />
            <Button 
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={requestStatus}
              startIcon={requestStatus && (
                <CircularProgress size={14}/>
              )}
            >{requestStatus ? 'Request Sent' : 'Add League'}</Button>
          </Stack>
        </FormProvider>
      </Stack>
    </Paper>
  )
}