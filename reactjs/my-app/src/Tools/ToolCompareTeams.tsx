import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { batch } from "react-redux";

import { Autocomplete, TextField, Button } from "@mui/material";

import { ILeagueSeason, ILeagueTeam } from "../Interfaces/league";
import { IBattingStatsExtended } from "../Interfaces/stats";
import { ITeam, ITeamSeason } from "../Interfaces/team";
import { IMatchLineup } from "../Interfaces/match";

import { IApiFetchMatchLineups, fetchMatchLineups } from "../ApiCall/matches";
import { IApiFetchLeagueTeamsParams, fetchLeagueTeams, 
  IApiFetchTeamsParams, fetchTeams, 
  IApiFetchTeamSeasonsParams, fetchTeamSeasons } from "../ApiCall/teams";

import CompareBattingStats from "../Stats/CompareBattingStats";

import { filterTeamsBySeason } from "../utils/dataFilter";
import { getCombinedTeamsStats } from "../utils/statsAggregation";

interface IFormInput {
  team: ITeam;
} 
const defaultValues = {
  team: {},
}
interface IToolCompareTeamsProps{
  leagueSeason: ILeagueSeason;
}

export default function ToolCompareTeams(props: IToolCompareTeamsProps) {

  const { leagueSeason } = props;

  const [listTeams, setListTeams] = useState<ITeam[]>([]);
  const [listLeagueTeams, setListLeagueTeams] = useState<ILeagueTeam[]>([]);
  const [listTeamSeasons, setListTeamSeasons] = useState<ITeamSeason[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<ITeam[]>([]);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[]>([]);
  const [teamsBattingStats, setTeamsBattingStats] = useState<IBattingStatsExtended[]>([]);

  useMemo(() => {
    let newLeagueTeams: ILeagueTeam[] = []
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      leagueIds:[leagueSeason.idLeague]
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        newLeagueTeams = response.data || [];

        const teamIds = newLeagueTeams.map((leagueTeam) => leagueTeam.idTeam);

        const paramsFetchTeams: IApiFetchTeamsParams = {
          teamIds: teamIds
        }
        const paramsFetchTeamSeasons: IApiFetchTeamSeasonsParams = {
          teamIds: teamIds
        }
        Promise.all([fetchTeams(paramsFetchTeams), fetchTeamSeasons(paramsFetchTeamSeasons)]).then((values) => {
          batch(() => {
            setListLeagueTeams(newLeagueTeams);
            setListTeams(values[0].data);
            setListTeamSeasons(values[1].data);
          })
        });
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }, [leagueSeason.idLeague]);

  const filteredTeams = filterTeamsBySeason(listTeams, listLeagueTeams, listTeamSeasons, leagueSeason);

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( selectedTeams.find((team) => team.id === data.team.id) !== undefined) return;

    let newSelectedTeams = selectedTeams.concat(data.team);
    

    const paramsMatchLineups: IApiFetchMatchLineups = {
      leagueSeasonIds:[leagueSeason.id],
      teamIds:[data.team.id]
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        setSelectedTeams(newSelectedTeams);
        setListMatchLineups(listMatchLineups.concat(response.data));
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }

  useEffect(() => {
    const filteredLineups = listMatchLineups.filter((matchLineup) => matchLineup.idSeason === leagueSeason.id)
    const listBattingStats  = getCombinedTeamsStats(filteredLineups);
    setTeamsBattingStats( listBattingStats );
  }, [leagueSeason.id, listMatchLineups])
  
  
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