
import { useEffect, useState } from 'react';
import { batch } from 'react-redux';

import { Box, Paper, Stack, Typography } from "@mui/material";

import { usePublicContext } from '../Public/PublicApp';

import { IMatch, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player';

import { fetchHistoryMatches, IApiFetchHistoryMatchesParams } from '../ApiCall/matches';

import PlayerMatchResume from './PlayerMatchResume'
import YearStats from '../Stats/YearStats';
import ProgressionStats from '../Stats/ProgressionStats';
import LoaderInfo from '../Generic/LoaderInfo';

import { filterMatchesByLeague, filterMatchesLineupsByLeague } from '../utils/dataFilter';


interface IPlayerProfileProps{
  player: IPlayer;
}

function ViewPlayerProfile(props: IPlayerProfileProps) {

  const { player } = props;

  const { league, leagueSeason, leagueSeasonTeams } = usePublicContext();

  const [apiError, changeApiError] = useState<string>("");
  const [listMatches, setListMatches] = useState<IMatch[]>([]);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const filteredMatches = filterMatchesByLeague(listMatches, league.id);
  const filteredMatchesLineups = filterMatchesLineupsByLeague(listMatchLineups, league.id);

  useEffect(() => {
    const paramsHistoryMatches: IApiFetchHistoryMatchesParams = {
      playerId: player.id,
      leagueSeasonId: leagueSeason.id
    }
    fetchHistoryMatches(paramsHistoryMatches)
      .then((response) => {
        batch(() => {
          /* setListTeams(response.data.teams); */
          const allMatches: IMatch[] = response.data.matches || [];
          allMatches.sort((a,b) => a.date < b.date ? -1 : 1);
          setListMatches(allMatches);
          setListMatchLineups(response.data.matchLineups);
          setDataLoaded(true);
        })
        
      })
      .catch((error) => {
        batch(() => {
          setDataLoaded(true);
          changeApiError(error);
        })
        
      })
      .finally(() => {

      })
  }, [leagueSeason.id, player.id])


  

  return (
    <>
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      <Paper component={Box} p={3} m={3}>
        <Stack spacing={3} alignItems="center" pb={3} width="100%">
          <Box>
            <Typography variant="h1" textAlign='center'>{player.name}</Typography>
            <Typography variant="subtitle1" textAlign='center'>{league.name} {leagueSeason.name}</Typography>
          </Box>
        
          { dataLoaded ? (
            <>
              <YearStats
                key={`player-year-stat-${player.id}`}
                matchLineups={filteredMatchesLineups}
                players={[player]}
                title={`${leagueSeason.name} batting stats`}
              /> 
              <ProgressionStats
                key={`progression-player-stat-${player.id}`}
                matches={filteredMatches}
                matchLineups={filteredMatchesLineups}
                teams={leagueSeasonTeams}
              />

            </>
          ) : ''}
        </Stack>
      </Paper>
      
      
      { dataLoaded && listMatches.length > 0 ? (
        <Paper component={Box} p={3} m={3}>
          <Stack spacing={3} alignItems="center" pb={3} width="100%">
            <Typography variant="h2">Player match history</Typography>
            { filteredMatches.map((match: IMatch) => {
              const teamHome = leagueSeasonTeams.find((team) => team.id === match.idTeamHome) || null;
              const teamAway = leagueSeasonTeams.find((team) => team.id === match.idTeamAway) || null;
              const playerLineup = listMatchLineups.find((lineup) => lineup.idMatch === match.id) || null;
              if( teamHome === null || teamAway === null || playerLineup === null ) return '';
              return (
                <PlayerMatchResume
                  key={`player-match-resume-${match.id}`}
                  playerLineup={playerLineup}
                  match={match}
                  player={player}
                  teamHome={teamHome}
                  teamAway={teamAway}
                />  
              )
            })}
          </Stack>
        </Paper>
      ) : ''}
    </>
  )
}

export default ViewPlayerProfile;