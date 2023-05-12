import { useState }  from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { addLeagueSeason } from '../redux/leagueSeasonSlice';

import { ILeagueSeason } from '../Interfaces/league';
import FormTextInput from '../Forms/FormTextInput';
import FormNumberInput from '../Forms/FormNumberInput';
import LoaderInfo from '../Generic/LoaderInfo';

import { createLeagueSeason, IApiCreateLeagueSeasonParams } from '../ApiCall/seasons';
import { addAdminLeagueSeasons, setAdminLeagueSeason } from '../redux/adminContextSlice';


interface IFormInput {
  name: string;
  year: number;
}

function CreateSeason() {
  const dispatch = useDispatch<AppDispatch>();
  const stateAdminContext = useSelector((state: RootState) => state.adminContext )

  const leagueName = stateAdminContext.currentLeague?.name || '';

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
          idLeague: response.data.idLeague,
          name: response.data.name,
          year: response.data.year,
        }
        dispatch(addLeagueSeason(dataLeagueSeason));
        dispatch(addAdminLeagueSeasons([dataLeagueSeason]));
        dispatch(setAdminLeagueSeason(dataLeagueSeason));
        window.localStorage.setItem("currentLeagueSeasonId", response.data.id);
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
        <Typography variant="h1">{`${leagueName}`} Seasons</Typography>
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