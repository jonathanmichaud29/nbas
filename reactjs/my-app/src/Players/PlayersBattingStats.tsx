import { useState, useMemo } from 'react';

import { Box, Paper, Stack, Typography  } from "@mui/material";

import { IPlayer, IPlayersBattingStatsProps } from "../Interfaces/player";
import { IMatchLineup } from '../Interfaces/match';

import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchMatchLineups, IApiFetchMatchLineups } from '../ApiCall/matches';

import YearStats from '../Stats/YearStats';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';

function PlayersBattingStats(props: IPlayersBattingStatsProps) {

  const { league } = props;

  const [listPlayers, setListPlayers] = useState<IPlayer[]>([]);
  const [listMatchesLineups, setListMatchesLineups] = useState<IMatchLineup[]>([]);
  const [playersLoaded, setPlayersLoaded] = useState<boolean>(false);
  const [matchesLineupsLoaded, setMatchesLineupsLoaded] = useState<boolean>(false);
  const [apiError, changeApiError] = useState("");

  const isLoaded = playersLoaded === true && matchesLineupsLoaded === true;
  
  setMetas({
    title:`${league.name} Players batting statistics`,
    description:`${league.name} players batting statistics for the current season`
  });
  
  /**
   * Fetch Players and Matches Lineups for the current league
   */
  useMemo( () => {
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      allPlayers: true,
      leagueIds: [league.id]
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        setListPlayers(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setPlayersLoaded(true);
      });

    const paramsMatchLineups: IApiFetchMatchLineups = {
      allLineups: true,
      leagueIds: [league.id]
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        setListMatchesLineups(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setMatchesLineupsLoaded(true);
      });
  }, [league]);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      <Paper component={Box} m={3} p={3}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h1">
            {league.name} Players Stats
          </Typography>

          {isLoaded && (
            <YearStats
              key={`year-players-stat`}
              matchLineups={listMatchesLineups}
              players={listPlayers}
              title={`League batting stats`}
            />
          )}
        </Stack>
      </Paper>
    </>
    
  )
}
export default PlayersBattingStats;