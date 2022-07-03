import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchPlayersParams {
  playerIds?: Array<number>;
  allPlayers?: boolean;
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

/**
 * Protected calls
 */

export interface IApiCreatePlayerParams {
  name: string;
}
export const createPlayer = async (bodyParams: IApiCreatePlayerParams) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/player/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiDeletePlayerParams {
  playerId: number;
}
export const deletePlayer = async (bodyParams: IApiDeletePlayerParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/player/${bodyParams.playerId}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
