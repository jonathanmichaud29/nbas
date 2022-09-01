
import { useEffect, useState } from 'react';

import { Box, Paper, Stack, Typography } from "@mui/material";

import { fetchHistoryMatches, IApiFetchHistoryMatchesParams } from '../ApiCall/matches';

import { IPlayerProfileProps } from '../Interfaces/player'
import { IMatch, IMatchLineup } from '../Interfaces/match'
import { ITeam } from '../Interfaces/team'

import PlayerMatchResume from './PlayerMatchResume'
import YearStats from '../Stats/YearStats';
import ProgressionStats from '../Stats/ProgressionStats';
import ChangePublicLeague from '../League/ChangePublicLeague';
import LoaderInfo from '../Generic/LoaderInfo';


function ViewPlayerProfile(props: IPlayerProfileProps) {

  const { player, playersLeagues } = props;

  const [apiError, changeApiError] = useState("");
  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listMatches, setListMatches] = useState<IMatch[] | null>(null);
  const [listMatchLineups, setListMatchLineups] = useState<IMatchLineup[] | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<number>(0);

  const isLoaded = listMatches !== null && listMatchLineups !== null && listTeams !== null;

  useEffect(() => {
    const paramsHistoryMatches: IApiFetchHistoryMatchesParams = {
      playerId: player.id,
    }
    fetchHistoryMatches(paramsHistoryMatches)
      .then((response) => {
        setListTeams(response.data.teams);
        const allMatches: IMatch[] = response.data.matches.map((match: IMatch) => match);
        allMatches.sort((a,b) => a.date < b.date ? -1 : 1);
        setListMatches(allMatches);
        setListMatchLineups(response.data.matchLineups);
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() => {

      })
  }, [player.id])

  const changeSelectedLeague = (idLeague:number) => {
    setSelectedLeague(idLeague);
  }

  return (
    <>
      { playersLeagues && (
        <ChangePublicLeague
          playersLeagues={playersLeagues}
          onLeagueChange={changeSelectedLeague}
        />
      )}
      <Paper component={Box} p={1} m={3}>
        <Stack spacing={3} alignItems="center" pb={3} width="100%">
          <LoaderInfo
            isLoading={isLoaded}
            msgError={apiError}
          />
          <Typography variant="h1">
            {player.name} Profile
          </Typography>
        
          { isLoaded && (
            <YearStats
              key={`player-year-stat-${player.id}`}
              matchLineups={selectedLeague === 0 ? listMatchLineups : listMatchLineups.filter((matchLineup) => matchLineup.idLeague === selectedLeague)}
              players={[player]}
              title={`League batting stats`}
            /> 
          )}
          { isLoaded && (
            <ProgressionStats
              key={`progression-player-stat-${player.id}`}
              matches={selectedLeague === 0 ? listMatches : listMatches.filter((match) => match.idLeague === selectedLeague)}
              matchLineups={selectedLeague === 0 ? listMatchLineups : listMatchLineups.filter((matchLineup) => matchLineup.idLeague === selectedLeague)}
              teams={listTeams}
            />
          )}
        </Stack>
      </Paper>
      
      
      { isLoaded && listMatches && listMatches.length > 0 && (
        <Paper component={Box} p={3} m={3}>
          <Stack spacing={3} alignItems="center" pb={3} width="100%">
            <Typography variant="h2">Player match history</Typography>
            { listMatches.filter((match) => selectedLeague === 0 || match.idLeague === selectedLeague).map((match: IMatch) => {
              const teamHome = listTeams.find((team) => team.id === match.idTeamHome)
              const teamAway = listTeams.find((team) => team.id === match.idTeamAway)
              const playerLineup = listMatchLineups.find((lineup) => lineup.idMatch === match.id)
              if( teamHome === undefined || teamAway === undefined || playerLineup === undefined ) return '';
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
      )}
    </>
  )
}

export default ViewPlayerProfile;