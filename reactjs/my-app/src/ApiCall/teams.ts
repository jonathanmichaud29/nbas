import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchTeamsParams {
  teamIds?: Array<number>;
  allTeams?: boolean;
  leagueIds?: Array<number>;
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

export interface IApiFetchLeagueTeamsParams {
  leagueIds?:Array<number>;
}
export const fetchLeagueTeams = async (bodyParams: IApiFetchLeagueTeamsParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/team-league/`,bodyParams)
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

export interface IApiCreateTeamParams {
  name: string;
}
export const createTeam = async (bodyParams: IApiCreateTeamParams) => {  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/team/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}


export interface IApiDeleteTeamParams {
  teamId: number;
}
export const deleteTeam = async (bodyParams: IApiDeleteTeamParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/team/${bodyParams.teamId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiDeleteLeagueTeamParams {
  idTeam: number;
}
export const deleteLeagueTeam = async (bodyParams: IApiDeleteLeagueTeamParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/team-league/${bodyParams.idTeam}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}