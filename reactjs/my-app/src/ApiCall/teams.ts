import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchTeamsParams {
  teamIds?: Array<number>;
  allTeams?: boolean;
}
export const fetchTeams = async (bodyParams: IApiFetchTeamsParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/team/`,bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiFetchStandingTeamsParams {
  teamIds?: Array<number>;
  allTeams?: boolean;
}
export const fetchStandingTeams = async (bodyParams: IApiFetchStandingTeamsParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/team/standing/`, bodyParams)
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

export const createTeam = async (argName: string) => {  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/team/`,{
    name: argName
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const deleteTeam = async (argId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/team/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
