import { IPlayer } from '../Interfaces/player';
import { ITeam } from '../Interfaces/team';

export const getPlayerName = (idPlayer: number, listPlayers: Array<IPlayer>): string => {
  const defaultReturn = "Player not found in lineup";
  if( listPlayers ){
    const playerFound = listPlayers.find((player) => player.id === idPlayer);
    if( playerFound ) return playerFound.name;
  }
  return defaultReturn;
}

export const getTeamName = (idTeam: number, listTeams: Array<ITeam>): string => {
  const defaultReturn = "Team not found in listing";
  if( listTeams ){
    const teamFound = listTeams.find((team) => team.id === idTeam);
    if( teamFound ) return teamFound.name;
  }
  return defaultReturn;
}