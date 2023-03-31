import { axiosProtected, axiosPublic } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchLeaguesParams {
  leagueIds?: Array<number>;
  allLeagues?: boolean;
}
export const fetchLeagues = async (bodyParams: IApiFetchLeaguesParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/league/`,bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiFetchPlayersLeaguesParams {
  playerIds?: Array<number>;
  leagueIds?: Array<number>;
}
export const fetchPlayersLeagues = async (bodyParams: IApiFetchPlayersLeaguesParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/players-leagues/`,bodyParams)
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

export interface IApiCreateLeagueParams {
  name: string;
}
export const createLeague = async (bodyParams: IApiCreateLeagueParams) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/league/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}