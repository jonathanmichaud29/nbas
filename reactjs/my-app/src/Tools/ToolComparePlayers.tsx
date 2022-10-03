import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Autocomplete, TextField, Button } from "@mui/material";

import { addLeaguePlayers } from "../redux/leaguePlayerSlice";
import { addPlayers } from "../redux/playerSlice";
import { AppDispatch, RootState } from "../redux/store";

import { ILeaguePlayer } from "../Interfaces/league";
import { IPlayer } from "../Interfaces/player";
import { IBattingStatsExtended, IToolComparePlayersProps } from "../Interfaces/stats";

import { IApiFetchMatchLineups, fetchMatchLineups } from "../ApiCall/matches";
import { IApiFetchLeaguePlayersParams, fetchLeaguePlayers, IApiFetchPlayersParams, fetchPlayers } from "../ApiCall/players";

import CompareBattingStats from "../Stats/CompareBattingStats";

import { getCombinedPlayersStats } from "../utils/statsAggregation";
import { filterPlayersByLeague } from "../utils/dataFilter";

interface IFormInput {
  player: IPlayer;
} 
const defaultValues = {
  player: {},
}



export default function ToolComparePlayers(props: IToolComparePlayersProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { league } = props;

  const listPlayers = useSelector((state: RootState) => state.players )
  const listLeaguePlayers = useSelector((state: RootState) => state.leaguePlayers )

  const [selectedPlayers, setSelectedPlayers] = useState<IPlayer[]>([]);
  const [playersBattingStats, setPlayersBattingStats] = useState<IBattingStatsExtended[]>([]);

  useMemo(() => {
    const paramsFetchLeaguePlayers: IApiFetchLeaguePlayersParams = {
      leagueIds:[league.id]
    }
    fetchLeaguePlayers(paramsFetchLeaguePlayers)
      .then(response => {
        dispatch(addLeaguePlayers(response.data));
        
        const playerIds = response.data.map((leaguePlayer: ILeaguePlayer) => leaguePlayer.idPlayer);
        const paramsFetchPlayers: IApiFetchPlayersParams = {
          playerIds: playerIds,
          leagueIds:[league.id]
        }
        fetchPlayers(paramsFetchPlayers)
          .then(response => {
            dispatch(addPlayers(response.data));
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

  const filteredPlayers = filterPlayersByLeague(listPlayers, listLeaguePlayers, league);


  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, control, formState: { errors } } = methods;
  const onSubmit: SubmitHandler<IFormInput> = data => {
    if( selectedPlayers.find((player) => player.id === data.player.id) !== undefined) return;

    setSelectedPlayers([...selectedPlayers, data.player]);

    const paramsMatchLineups: IApiFetchMatchLineups = {
      leagueIds:[league.id],
      playerIds:[data.player.id]
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        setPlayersBattingStats( [...playersBattingStats, getCombinedPlayersStats(response.data)[0]] );
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }

  
  
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
            options={filteredPlayers}
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