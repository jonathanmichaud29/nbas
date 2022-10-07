import { useMemo, useState } from 'react';

import { Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IApiFetchMatchLineups, fetchMatchLineups } from '../ApiCall/matches';
import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from '../ApiCall/teamsPlayers';

import { IMatch, IMatchLineup } from '../Interfaces/match'
import { IPlayer } from '../Interfaces/player'
import { ITeam, ITeamPlayers } from '../Interfaces/team'
import { IBattingStatsExtended } from '../Interfaces/stats'

import LoaderInfo from '../Generic/LoaderInfo';

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats } from '../utils/statsAggregation';


interface IBestMatchPlayersProps {
  match: IMatch;
  team: ITeam;
}

export default function BestMatchPlayers(props: IBestMatchPlayersProps) {
  const {match, team} = props;

  const [apiError, changeApiError] = useState("");
  const [bestStatPlayers, setBestStatPlayers] = useState<IBattingStatsExtended[] | null>(null);
  const [listPlayers, setListPlayers] = useState<IPlayer[] | null>(null);

  const isLoaded = bestStatPlayers !== null && listPlayers !== null;

  /**
   * Fetch Best players stats for this specific match or season
   */
  useMemo(() => {
    if( match.isCompleted === 1 ) {
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
    }

    if( match.isCompleted === 0 ) {
      const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
        teamIds: [team.id],
        leagueIds: [match.idLeague]
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
      }
  },[match, team])

  /**
   * Fetch Players Information about the best players found
   */
  useMemo(() => {
    if( bestStatPlayers === null ) return;
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: bestStatPlayers.map((playerStats) => playerStats.id),
      allLeagues:true
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
  }, [bestStatPlayers])

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
      />
      
      { isLoaded && bestStatPlayers.length > 0 && listPlayers.length > 0 && (
        <>
          <Typography variant="h4" textAlign="center">
            {team.name}
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
        </>
      )} 
    </>
  )
}