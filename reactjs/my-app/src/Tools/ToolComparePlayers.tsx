import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Autocomplete, TextField, Button } from "@mui/material";

import { ILeagueSeason } from "../Interfaces/league";
import { IPlayer } from "../Interfaces/player";
import { IBattingStatsExtended } from "../Interfaces/stats";

import { IApiFetchMatchLineups, fetchMatchLineups } from "../ApiCall/matches";
import { IApiFetchPlayersParams, fetchPlayers } from "../ApiCall/players";

import CompareBattingStats from "../Stats/CompareBattingStats";

import { getCombinedPlayersStats } from "../utils/statsAggregation";
import { IMatchLineup } from "../Interfaces/match";
import { batch } from "react-redux";

interface IFormInput {
  player: IPlayer;
} 
const defaultValues = {
  player: {},
}

interface IToolComparePlayersProps{
  leagueSeason: ILeagueSeason;
}

export default function ToolComparePlayers(props: IToolComparePlayersProps) {

  const { leagueSeason } = props;

  const [listPlayers, setListPlayers] = useState<IPlayer[]>([]);

  const [selectedPlayers, setSelectedPlayers] = useState<IPlayer[]>([]);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[]>([]);
  const [playersBattingStats, setPlayersBattingStats] = useState<IBattingStatsExtended[]>([]);

  useEffect(() => {
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      allPlayers: true,
      leagueIds:[leagueSeason.idLeague]
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        batch(()=>{
          setListPlayers(response.data);
        })
        
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }, [leagueSeason])

  

  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( selectedPlayers.find((player) => player.id === data.player.id) !== undefined) return;
    const newSelectedPlayers = selectedPlayers.concat(data.player);
    
    const paramsMatchLineups: IApiFetchMatchLineups = {
      leagueIds:[leagueSeason.idLeague],
      playerIds:[data.player.id]
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        batch(() => {
          setSelectedPlayers(newSelectedPlayers);
          const newLineups = listMatchLineups.concat(response.data);
          setListMatchLineups(newLineups);
        })
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }

  useEffect(() => {
    const filteredLineups = listMatchLineups.filter((matchLineup) => matchLineup.idSeason === leagueSeason.id)
    const listBattingStats  = getCombinedPlayersStats(filteredLineups);
    setPlayersBattingStats( listBattingStats );
  }, [leagueSeason.id, listMatchLineups])
  
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
            options={listPlayers}
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
        />
      )}
    </>
  )
}