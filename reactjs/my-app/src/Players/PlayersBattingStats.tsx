import { useState, useEffect } from 'react';
import { batch } from 'react-redux';

import { Box, Paper, Stack, Typography  } from "@mui/material";

import { usePublicContext } from '../Public/PublicApp';

import { IMatchLineup } from '../Interfaces/match';

import { fetchMatchLineups, IApiFetchMatchLineups } from '../ApiCall/matches';

import YearStats from '../Stats/YearStats';
import LoaderInfo from '../Generic/LoaderInfo';

interface IPlayersBattingStatsProps {
  
}

function PlayersBattingStats(props: IPlayersBattingStatsProps) {

  const { league, leagueSeason, leaguePlayers } = usePublicContext();

  const [listMatchesLineups, setListMatchesLineups] = useState<IMatchLineup[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [apiError, changeApiError] = useState("");
  
  
  
  /**
   * Fetch Players and Matches Lineups for the current league
   */
  useEffect( () => {
    let newListMatchLineups: IMatchLineup[] = []

    const paramsMatchLineups: IApiFetchMatchLineups = {
      allLineups: true,
      leagueSeasonIds: [leagueSeason.id]
    }

    Promise.all([fetchMatchLineups(paramsMatchLineups)])
      .catch((error) => {
        changeApiError(error);
      })
      .then((values) =>{
        if( ! values ) return;
        newListMatchLineups = values[0].data || [];
      })
      .finally(()=>{
        batch(()=>{
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
          <Box>
            <Typography variant="h1" textAlign='center'>Players Stats</Typography>
            <Typography variant="subtitle1" textAlign='center'>{league.name} {leagueSeason.name}</Typography>
          </Box>

          { dataLoaded ? (
            <YearStats
              key={`year-players-stat`}
              matchLineups={listMatchesLineups}
              players={leaguePlayers}
              title={`${leagueSeason.name} batting stats`}
            />
          ) : ''}
        </Stack>
      </Paper>
    </>
    
  )
}
export default PlayersBattingStats;