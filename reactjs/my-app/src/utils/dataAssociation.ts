import { IPlayer } from '../Interfaces/Player';

export const getPlayerName = (idPlayer: number, listPlayers: Array<IPlayer>): string => {
  const defaultReturn = "Player not found in lineup";
  if( listPlayers ){
    const playerFound = listPlayers.find((player) => player.id === idPlayer);
    if( playerFound ) return playerFound.name;
  }
  return defaultReturn;
}