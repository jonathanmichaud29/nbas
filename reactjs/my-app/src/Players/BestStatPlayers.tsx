import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IApiFetchMatchLineups, fetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from '../ApiCall/teamsPlayers';

import { IMatch, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'
import { ITeam, ITeamPlayers } from '../Interfaces/team'
import { IBattingStatsExtended } from '../Interfaces/stats'

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats } from '../utils/statsAggregation';


interface IBestStatPlayersProps {
  match: IMatch;
  team: ITeam;
}

function BestStatPlayers(props: IBestStatPlayersProps) {
  const {match, team} = props;

  const [apiError, changeApiError] = useState("");
  const [bestStatPlayers, setBestStatPlayers] = useState<IBattingStatsExtended[] | null>(null);
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);

  const isLoaded = bestStatPlayers !== null && listPlayers !== null;

  /**
   * Fetch Best players stats for this specific match
   */
  useEffect(() => {
    if( bestStatPlayers !== null || match.isCompleted === 0 ) return;

    const paramsMatchLineups: IApiFetchMatchLineups = {
      matchId: match.id,
      teamId: team.id,
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        const listMatchLineups: IMatchLineup[] = response.data;
        const playersStats = getCombinedPlayersStats(listMatchLineups)

        // sort players by highest Slugging %, Batting Average
        playersStats.sort((a,b) => b.sluggingPercentage - a.sluggingPercentage && b.battingAverage - a.battingAverage)
        // Keep the 3 best stat players
        setBestStatPlayers(playersStats.slice(0,3));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [match, team, bestStatPlayers])

  /**
   * Fetch Best players stats for this season
   */
  useEffect(() => {
    if( bestStatPlayers !== null || match.isCompleted === 1 ) return;
    const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
      teamIds: [team.id],
    }
    fetchTeamsPlayers(paramsFetchTeamsPlayers)
      .then(response => {
        const listTeamPlayers: ITeamPlayers[] = response.data;
        const paramsMatchLineups: IApiFetchMatchLineups = {
          playerIds: listTeamPlayers.map((teamPlayer) => teamPlayer.playerId),
        }
        fetchMatchLineups(paramsMatchLineups)
          .then(response => {
            const listMatchLineups: IMatchLineup[] = response.data;
            const playersStats = getCombinedPlayersStats(listMatchLineups)
    
            // sort players by highest Slugging %, Batting Average
            playersStats.sort((a,b) => b.sluggingPercentage - a.sluggingPercentage && b.battingAverage - a.battingAverage)
            // Keep the 3 best stat players
            setBestStatPlayers(playersStats.slice(0,3));
          })
          .catch(error => {
            changeApiError(error);
          })
          .finally(() => {
            
          });
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[bestStatPlayers, match, team])

  /**
   * Fetch Players Information about the best players found
   */
  useEffect(() => {
    if( listPlayers !== null || bestStatPlayers === null ) return;
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: bestStatPlayers.map((playerStats) => playerStats.id)
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        setListPlayers(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [bestStatPlayers, listPlayers])

  return (
    <>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { isLoaded && bestStatPlayers.length > 0 && (
        <Box m={3}>
          <Typography variant="h6" component="h3" textAlign="center">
            Best {team.name} players {match.isCompleted === 1 ? 'this game' : 'this season'}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell align="center">AVG</TableCell>
                  <TableCell align="center">SLG</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { bestStatPlayers.map((statPlayer) => (
                  <TableRow key={`best-player-stat-${statPlayer.id}`}>
                    <TableCell>{getPlayerName(statPlayer.id, listPlayers)}</TableCell>
                    <TableCell align="center">{statPlayer.battingAverage}</TableCell>
                    <TableCell align="center">{statPlayer.sluggingPercentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )} 
    </>
  )
}

export default BestStatPlayers;