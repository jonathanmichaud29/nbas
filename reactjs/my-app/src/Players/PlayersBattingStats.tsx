import { useState, useEffect } from 'react';

import { Box, Paper, Stack, Typography  } from "@mui/material";

import { IPlayer, IPlayersBattingStatsProps } from "../Interfaces/player";
import { IMatchLineup } from '../Interfaces/match';

import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchMatchLineups, IApiFetchMatchLineups } from '../ApiCall/matches';

import YearStats from '../Stats/YearStats';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';
import { batch } from 'react-redux';

function PlayersBattingStats(props: IPlayersBattingStatsProps) {

  const { leagueSeason } = props;

  const [listPlayers, setListPlayers] = useState<IPlayer[]>([]);
  const [listMatchesLineups, setListMatchesLineups] = useState<IMatchLineup[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [apiError, changeApiError] = useState("");
  
  setMetas({
    title:`${leagueSeason.name} Players batting statistics`,
    description:`${leagueSeason.name} players batting statistics for the current season`
  });
  
  /**
   * Fetch Players and Matches Lineups for the current league
   */
  useEffect( () => {
    let newListPlayers: IPlayer[] = []
    let newListMatchLineups: IMatchLineup[] = []
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      allPlayers: true,
      leagueSeasonIds: [leagueSeason.id]
    }
    const paramsMatchLineups: IApiFetchMatchLineups = {
      allLineups: true,
      leagueSeasonIds: [leagueSeason.id]
    }

    Promise.all([fetchPlayers(paramsFetchPlayers), fetchMatchLineups(paramsMatchLineups)])
      .catch((error) => {
        changeApiError(error);
      })
      .then((values) =>{
        if( ! values ) return;
        newListPlayers = values[0].data || [];
        newListMatchLineups = values[1].data || [];
      })
      .finally(()=>{
        batch(()=>{
          setListPlayers(newListPlayers)
          setListMatchesLineups(newListMatchLineups)
          setDataLoaded(true);
        })
      })

  }, [leagueSeason]);

  return (
    <>
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      <Paper component={Box} m={3} p={3}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h1">
            {leagueSeason.name} Players Stats
          </Typography>

          { (dataLoaded && listMatchesLineups.length && listPlayers.length ) ? (
            <YearStats
              key={`year-players-stat`}
              matchLineups={listMatchesLineups}
              players={listPlayers}
              title={`League batting stats`}
            />
          ) : ''}
        </Stack>
      </Paper>
    </>
    
  )
}
export default PlayersBattingStats;