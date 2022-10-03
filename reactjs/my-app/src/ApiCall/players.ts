import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchPlayersParams {
  playerIds?: Array<number>;
  allPlayers?: boolean;
  allLeagues?: boolean;
  leagueIds?: Array<number>;
}
export const fetchPlayers = async (bodyParams: IApiFetchPlayersParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/player/`,bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiFetchLeaguePlayersParams {
  leagueIds?:Array<number>;
}
export const fetchLeaguePlayers = async (bodyParams: IApiFetchPlayersParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/player-league/`,bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

/**
 * Protected calls
 */

export interface IApiCreatePlayerParams {
  name: string;
  existingPlayer?: number;
}
export const createPlayer = async (bodyParams: IApiCreatePlayerParams) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/player/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data);
    })
}

export interface IApiDeleteLeaguePlayerParams {
  idPlayer: number;
}
export const deleteLeaguePlayer = async (bodyParams: IApiDeleteLeaguePlayerParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/player-league/${bodyParams.idPlayer}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
