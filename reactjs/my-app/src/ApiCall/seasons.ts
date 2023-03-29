import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchLeagueSeasonsParams {
  leagueIds?:Array<number>;
  seasonIds?:Array<number>;
}
export const fetchLeagueSeasons = async (bodyParams: IApiFetchLeagueSeasonsParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/league-season/`,bodyParams)
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

export interface IApiCreateLeagueSeasonParams {
  name: string;
  year: number;
}
export const createLeagueSeason = async (bodyParams: IApiCreateLeagueSeasonParams) => {  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/league-season/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiDeleteLeagueSeasonParams {
  idSeason: number;
}
export const deleteLeagueSeason = async (bodyParams: IApiDeleteLeagueSeasonParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/league-season/${bodyParams.idSeason}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}