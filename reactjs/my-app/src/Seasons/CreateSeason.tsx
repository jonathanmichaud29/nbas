import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";

import { AppDispatch } from "../redux/store";
import { addLeagueSeason } from '../redux/leagueSeasonSlice';

import { ILeagueSeason } from '../Interfaces/league';
import FormTextInput from '../Forms/FormTextInput';
import FormNumberInput from '../Forms/FormNumberInput';
import LoaderInfo from '../Generic/LoaderInfo';

import { getStorageLeagueId, getStorageLeagueName } from '../utils/localStorage';
import { createLeagueSeason, IApiCreateLeagueSeasonParams } from '../ApiCall/seasons';


interface IFormInput {
  name: string;
  year: number;
}

function CreateSeason() {
  const dispatch = useDispatch<AppDispatch>();

  const currentLeagueName = getStorageLeagueName();
  
  const [apiInfo, changeApiInfo] = useState<string>("");
  const [apiError, changeApiError] = useState<string>("");
  const [apiWarning, changeApiWarning] = useState<string>("");
  const [apiSuccess, changeApiSuccess] = useState<string>("");
  const [requestStatus, setRequestStatus] = useState<boolean>(false);
  
  const currentYear = new Date().getFullYear();
  const defaultValues = {
    name: "",
    year: currentYear,
  }

  const reinitializeApiMessages = () => {
    changeApiInfo('');
    changeApiError('');
    changeApiWarning('');
    changeApiSuccess('');
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;

    setRequestStatus(true);
    reinitializeApiMessages();
    
    const paramsCreateLeagueSeason: IApiCreateLeagueSeasonParams = {
      name: data.name,
      year: data.year,
    }
    createLeagueSeason(paramsCreateLeagueSeason)
      .then((response) =>{
        reset()
        changeApiSuccess(response.message);

        const dataLeagueSeason: ILeagueSeason = {
          id: response.data.id,
          idLeague: response.data.leagueId,
          name: response.data.name,
          year: response.data.year,
        }
        dispatch(addLeagueSeason(dataLeagueSeason));
      })
      .catch(error => {
        changeApiError(error.message);
      })
      .finally(() => {
        setRequestStatus(false);
      })
  }

  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h1">{`${currentLeagueName}`} Seasons</Typography>
        <Typography variant="subtitle1">Add new season into league</Typography>
        <LoaderInfo
          msgError={apiError}
          msgWarning={apiWarning}
          msgInfo={apiInfo}
          msgSuccess={apiSuccess}
        />
        <FormProvider {...methods}>
          <Stack spacing={2} alignItems="center">
            <FormTextInput
              label={`New season name`}
              controllerName={`name`}
              type="text"
              isRequired={true}
            />

            <FormNumberInput
              label={`Year`}
              controllerName={`year`}
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
            >{requestStatus ? 'Request Sent' : 'Add Season'}</Button>

          </Stack>
        </FormProvider>
      </Stack>
    </Paper>
  );
}

export default CreateSeason;