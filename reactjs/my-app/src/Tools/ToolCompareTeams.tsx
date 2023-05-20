import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { batch } from "react-redux";

import { Autocomplete, TextField, Button } from "@mui/material";

import { usePublicContext } from "../Public/PublicApp";

import { IBattingStatsExtended, defaultBattingStatsExtended } from "../Interfaces/stats";
import { ITeam} from "../Interfaces/team";
import { IMatchLineup } from "../Interfaces/match";

import CompareBattingStats from "../Stats/CompareBattingStats";

import { getAverageBattingStats, getCombinedTeamsStats } from "../utils/statsAggregation";


interface IFormInput {
  team: ITeam;
} 
const defaultValues = {
  team: {},
}
interface IToolCompareTeamsProps{
  matchesLineups: IMatchLineup[];
}

export default function ToolCompareTeams(props: IToolCompareTeamsProps) {

  const { matchesLineups } = props;

  const { leagueSeasonTeams } = usePublicContext();

  const [selectedTeams, setSelectedTeams] = useState<ITeam[]>([]);
  const [teamsBattingStats, setTeamsBattingStats] = useState<IBattingStatsExtended[]>([]);
  const [leagueAverageBattingStats, setLeagueAverageBattingStats] = useState<IBattingStatsExtended>({...defaultBattingStatsExtended});

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( selectedTeams.find((team) => team.id === data.team.id) !== undefined) return;

    let newSelectedTeams = selectedTeams.concat(data.team);
    const listSelectedTeamIds = newSelectedTeams.map((team) => team.id) || []

    const newListMatchLineups = matchesLineups.filter((matchLineup) => listSelectedTeamIds.includes(matchLineup.idTeam)) || []
    const listBattingStats  = getCombinedTeamsStats(newListMatchLineups);

    batch(() => {
      setSelectedTeams(newSelectedTeams);
      setTeamsBattingStats(listBattingStats);
    })
  }

  useEffect(() => {
    const listBattingStats  = getCombinedTeamsStats(matchesLineups).filter((battingStats) => battingStats.plateAppearance !== 0);
    const nbTeams = listBattingStats.length;
    const averageStats = getAverageBattingStats(listBattingStats, nbTeams);
    setLeagueAverageBattingStats(averageStats);
  }, [matchesLineups])
  
  
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
            options={leagueSeasonTeams}
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
          leagueStats={leagueAverageBattingStats}
          teams={selectedTeams}
        />
      )}
    </>
  )
}