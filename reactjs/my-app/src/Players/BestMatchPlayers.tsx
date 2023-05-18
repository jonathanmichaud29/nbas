import { useEffect, useState } from 'react';
import { batch } from 'react-redux';

import { Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { usePublicContext } from '../Public/PublicApp';

import { IApiFetchMatchLineups, fetchMatchLineups } from '../ApiCall/matches';
import { fetchTeamsPlayers, IApiFetchTeamsPlayersParams } from '../ApiCall/teamsPlayers';

import { IMatch, IMatchLineup } from '../Interfaces/match'
import { ITeam, ITeamPlayers } from '../Interfaces/team'
import { IBattingStatsExtended } from '../Interfaces/stats'

import LoaderInfo from '../Generic/LoaderInfo';

import { getPlayerName } from '../utils/dataAssociation';
import { getCombinedPlayersStats } from '../utils/statsAggregation';


interface IBestMatchPlayersProps {
  match: IMatch;
  team: ITeam;
  matchLineups?: IMatchLineup[];
}

export default function BestMatchPlayers(props: IBestMatchPlayersProps) {
  
  const {match, team, matchLineups } = props;

  const { leaguePlayers } = usePublicContext();

  const [apiError, changeApiError] = useState("");
  const [bestStatPlayers, setBestStatPlayers] = useState<IBattingStatsExtended[] | null>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  /**
   * Fetch Best players stats for this specific match or season
   */
  useEffect(() => {
    let newBestPlayersStats: IBattingStatsExtended[] = []

    if( match.isCompleted === 1 ) {
      if( matchLineups && matchLineups.length !== 0 ){
        const teamMatchLineups = matchLineups.filter((matchLineup) => matchLineup.idTeam === team.id) || []
        const playersStats = getCombinedPlayersStats(teamMatchLineups);
        playersStats.sort((a,b) => b.sluggingPercentage - a.sluggingPercentage && b.battingAverage - a.battingAverage)
        newBestPlayersStats = playersStats.slice(0,3);
        batch(() => {
          setDataLoaded(true);
          setBestStatPlayers(newBestPlayersStats);
        })
        
      }
      else {
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
            newBestPlayersStats = playersStats.slice(0,3);
          })
          .catch(error => {
            batch(() => {
              changeApiError(error);
              setDataLoaded(true);
            })
          })
          .finally(() => {
            batch(() => {
              setBestStatPlayers(newBestPlayersStats);
              setDataLoaded(true);
            })
          });
      }
    }

    if( match.isCompleted === 0 ) {
      const paramsFetchTeamsPlayers: IApiFetchTeamsPlayersParams = {
        teamIds: [team.id],
        leagueSeasonIds: [match.idSeason]
      }
      fetchTeamsPlayers(paramsFetchTeamsPlayers)
        .then(response => {
          
          const listTeamPlayers: ITeamPlayers[] = response.data;
          const paramsMatchLineups: IApiFetchMatchLineups = {
            playerIds: listTeamPlayers.map((teamPlayer) => teamPlayer.playerId),
            leagueSeasonIds: [match.idSeason]
          }
          fetchMatchLineups(paramsMatchLineups)
            .then(response => {
              const listMatchLineups: IMatchLineup[] = response.data;
              const playersStats = getCombinedPlayersStats(listMatchLineups)
      
              // sort players by highest Slugging %, Batting Average
              playersStats.sort((a,b) => b.sluggingPercentage - a.sluggingPercentage && b.battingAverage - a.battingAverage)
              // Keep the 3 best stat players
              newBestPlayersStats = playersStats.slice(0,3)
              
            })
            .catch(error => {
              batch(() => {
                changeApiError(error);
                setDataLoaded(true);
              })
            })
            .finally(() => {
              batch(() =>{
                setBestStatPlayers(newBestPlayersStats);
                setDataLoaded(true);
              })
            });
        })
        .catch(error => {
          batch(() => {
            changeApiError(error);
            setDataLoaded(true);
          })
          
        })
        .finally(() => {
          
        });
      }
  },[match, matchLineups, team])

  /**
   * Fetch Players Information about the best players found
   */
  
  return (
    <>
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
      />
      
      { dataLoaded ? (
        <>
          <Typography variant="h4" textAlign="center">
            {team.name}
          </Typography>
          { bestStatPlayers === null || bestStatPlayers.length === 0
          ?
            <LoaderInfo
              msgWarning={`No stats available for ${team.name}`}
            />
          :
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
                      <TableCell>{getPlayerName(statPlayer.id, leaguePlayers)}</TableCell>
                      <TableCell align="center">{statPlayer.battingAverage}</TableCell>
                      <TableCell align="center">{statPlayer.sluggingPercentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </>
      ) : ''} 
    </>
  )
}