import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { batch } from "react-redux";

import { Autocomplete, TextField, Button } from "@mui/material";

import { usePublicContext } from "../Public/PublicApp";

import { IPlayer } from "../Interfaces/player";
import { IBattingStatsExtended, defaultBattingStatsExtended } from "../Interfaces/stats";
import { IMatchLineup } from "../Interfaces/match";

import CompareBattingStats from "../Stats/CompareBattingStats";

import { getAverageBattingStats, getCombinedPlayersStats } from "../utils/statsAggregation";

interface IFormInput {
  player: IPlayer;
} 
const defaultValues = {
  player: {},
}

interface IToolComparePlayersProps{
  matchesLineups: IMatchLineup[];
}

export default function ToolComparePlayers(props: IToolComparePlayersProps) {

  const { matchesLineups } = props;

  const { leaguePlayers } = usePublicContext();

  const [selectedPlayers, setSelectedPlayers] = useState<IPlayer[]>([]);
  const [playersBattingStats, setPlayersBattingStats] = useState<IBattingStatsExtended[]>([]);
  const [leagueAverageBattingStats, setLeagueAverageBattingStats] = useState<IBattingStatsExtended>({...defaultBattingStatsExtended});

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( selectedPlayers.find((player) => player.id === data.player.id) !== undefined) return;
    const newSelectedPlayers = selectedPlayers.concat(data.player);
    const listSelectedPlayerIds = newSelectedPlayers.map((player) => player.id) || []
    
    const newListMatchLineups = matchesLineups.filter((matchLineup) => listSelectedPlayerIds.includes(matchLineup.idPlayer)) || []
    const listBattingStats  = getCombinedPlayersStats(newListMatchLineups);

    batch(() => {
      setSelectedPlayers(newSelectedPlayers);
      setPlayersBattingStats( listBattingStats );
    })
  }

  useMemo(() => {
    const listBattingStats = getCombinedPlayersStats(matchesLineups).filter((battingStats) => battingStats.plateAppearance !== 0);
    const nbPlayers = listBattingStats.length;
    const averageStats = getAverageBattingStats(listBattingStats, nbPlayers);
    setLeagueAverageBattingStats(averageStats);
  }, [matchesLineups])

  return (
    <>
    
      <Controller
        name={"player"}
        control={control}
        rules={{ 
          required: "This is required",
        }}
        render={({ field: { onChange, value } }) => (
          <Autocomplete 
            fullWidth
            id={"player-autocomplete"}
            disablePortal={false}
            onChange={(_, data) => {
              onChange(data);
              return data;
            }}
            options={leaguePlayers}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id }
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Available Players" 
                error={errors.player ? true : false}
                helperText={errors.player && (errors.player as any).message }
              />
            )}
          />
        )}
      />
      <Button 
        onClick={handleSubmit(onSubmit)}
        variant="contained"
      >Add player to compare</Button>

      { playersBattingStats.length > 0 && (
        <CompareBattingStats
          battingStats={playersBattingStats}
          players={selectedPlayers}
          leagueStats={leagueAverageBattingStats}
        />
      )}
    </>
  )
}