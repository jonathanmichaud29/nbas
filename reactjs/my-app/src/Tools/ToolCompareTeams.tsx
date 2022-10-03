import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Autocomplete, TextField, Button } from "@mui/material";

import { addLeagueTeams } from "../redux/leagueTeamSlice";
import { AppDispatch, RootState } from "../redux/store";
import { addTeams } from "../redux/teamSlice";

import { ILeagueTeam } from "../Interfaces/league";
import { IBattingStatsExtended, IToolCompareTeamsProps } from "../Interfaces/stats";
import { ITeam } from "../Interfaces/team";

import { IApiFetchMatchLineups, fetchMatchLineups } from "../ApiCall/matches";
import { IApiFetchLeagueTeamsParams, fetchLeagueTeams, IApiFetchTeamsParams, fetchTeams } from "../ApiCall/teams";

import CompareBattingStats from "../Stats/CompareBattingStats";

import { filterTeamsByLeague } from "../utils/dataFilter";
import { getCombinedTeamsStats } from "../utils/statsAggregation";

interface IFormInput {
  team: ITeam;
} 
const defaultValues = {
  team: {},
}

export default function ToolCompareTeams(props: IToolCompareTeamsProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { league } = props;

  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )

  const [selectedTeams, setSelectedTeams] = useState<ITeam[]>([]);
  const [teamsBattingStats, setTeamsBattingStats] = useState<IBattingStatsExtended[]>([]);

  useMemo(() => {
    
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      leagueIds:[league.id]
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        dispatch(addLeagueTeams(response.data));

        const teamIds = response.data.map((leagueTeam: ILeagueTeam) => leagueTeam.idTeam);
        const paramsFetchTeams: IApiFetchTeamsParams = {
          teamIds: teamIds,
          leagueIds:[league.id]
        }

        fetchTeams(paramsFetchTeams)
          .then(response => {
            dispatch(addTeams(response.data));
          })
          .catch(error => {
            
          })
          .finally(() => {
            
          });
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }, [dispatch, league.id]);

  const filteredTeams = filterTeamsByLeague(listTeams, listLeagueTeams, league);

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( selectedTeams.find((team) => team.id === data.team.id) !== undefined) return;

    setSelectedTeams([...selectedTeams, data.team]);

    const paramsMatchLineups: IApiFetchMatchLineups = {
      leagueIds:[league.id],
      teamIds:[data.team.id]
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        console.log("response", response.data)
        setTeamsBattingStats( [...teamsBattingStats, getCombinedTeamsStats(response.data)[0]] );
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }

  
  
  
  return (
    <>
      <Controller
        name={"team"}
        control={control}
        rules={{ 
          required: "This is required",
        }}
        render={({ field: { onChange, value } }) => (
          <Autocomplete 
            fullWidth
            id={"team-autocomplete"}
            disablePortal={false}
            onChange={(_, data) => {
              onChange(data);
              return data;
            }}
            options={filteredTeams}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id }
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Available Teams" 
                error={errors.team ? true : false}
                helperText={errors.team && (errors.team as any).message }
              />
            )}
          />
        )}
      />
      <Button 
        onClick={handleSubmit(onSubmit)}
        variant="contained"
      >Add Team to compare</Button>

      { teamsBattingStats.length > 0 && (
        <CompareBattingStats
          battingStats={teamsBattingStats}
          teams={selectedTeams}
        />
      )}
    </>
  )
}