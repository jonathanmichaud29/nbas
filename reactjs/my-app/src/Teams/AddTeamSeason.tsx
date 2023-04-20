import { useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { Stack, Typography, Button, CircularProgress } from '@mui/material';

import { AppDispatch, RootState } from '../redux/store';
import { addLeagueTeam } from '../redux/leagueTeamSlice';
import { addTeamSeason } from '../redux/teamSeasonSlice';

import { ILeagueTeam } from '../Interfaces/league';
import { ITeamSeason } from '../Interfaces/team';

import { createTeamSeason, IApiAddTeamSeasonParams } from '../ApiCall/teams';

import LoaderInfo from '../Generic/LoaderInfo';
import FormSelect from '../Forms/FormSelect';

import { filterTeamsNotInSeason } from '../utils/dataFilter';

interface IFormInput {
  idTeam: number;
}

function AddTeamSeason() {
  const dispatch = useDispatch<AppDispatch>();
  
  const stateAdminContext = useSelector((state: RootState) => state.adminContext )
  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )
  const listTeamSeasons = useSelector((state: RootState) => state.teamSeasons )

  const currentLeagueName = stateAdminContext.currentLeague?.name || '';

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(false);

  const filteredTeams = filterTeamsNotInSeason(listTeams, listLeagueTeams, listTeamSeasons, stateAdminContext.currentLeagueSeason);
  filteredTeams.sort((a, b) => a.name.localeCompare(b.name));
  
  const teamOptions = filteredTeams.map((team) => {
    return {
      value:team.id, 
      label:team.name
    }
  })

  const defaultValues = {
    idTeam: 0
  }

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( requestStatus ) return;

    setRequestStatus(true);
    reinitializeApiMessages();

    const paramsAddTeamSeason: IApiAddTeamSeasonParams = {
      idTeam: data.idTeam
    }
    createTeamSeason(paramsAddTeamSeason)
      .then((response) =>{
        reset();
        changeApiSuccess(response.message);
        
        const dataLeagueTeam: ILeagueTeam = {
          idTeam: response.data.teamId,
          idLeague: response.data.leagueId,
        }
        const dataTeamSeason: ITeamSeason = {
          idTeam: response.data.teamId,
          idLeagueSeason: response.data.seasonId,
        }
        batch(() => {
          dispatch(addLeagueTeam(dataLeagueTeam));
          dispatch(addTeamSeason(dataTeamSeason));
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
    <Stack spacing={1} alignItems="center" pb={3}>
      <Typography variant="h1">Add team to season</Typography>
      <Typography variant="subtitle1">{currentLeagueName}</Typography>
      <LoaderInfo
        msgError={apiError}
      />
      <FormProvider {...methods}>
        <Stack spacing={2} alignItems="center">
          
          { ( teamOptions && teamOptions.length ) > 0 ? (
            <FormSelect
              label="Select a team"
              controllerKey="idTeam"
              controllerName="idTeam"
              isRequired={true}
              fieldMinValue={1}
              fieldMinValueMessage={`A Team is required`}
              options={teamOptions}
              optionKeyPrefix={`add-team-season-`}
              defaultOptions={[{
                value: 0,
                label: "-- Choose a team --"
              }]}
            />
          ) : ''}

          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={requestStatus}
            startIcon={requestStatus && (
              <CircularProgress size={14}/>
            )}
          >{requestStatus ? 'Request Sent' : 'Assign team to season'}</Button>

          <LoaderInfo
            msgSuccess={apiSuccess}
          />
        </Stack>
      </FormProvider>
    </Stack>
  )
}
export default AddTeamSeason;
