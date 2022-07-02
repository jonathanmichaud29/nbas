import { ITeamPlayers } from '../Interfaces/team';
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
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/team/standing/`, bodyParams)
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








/**
 * Uncleaned calls
 */



export const fetchTeamHistoryMatches = async (id: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team-matches/${id}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}



export const fetchTeamPlayers = async (argId?: number) => {
  if( argId ) {
    return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team-players/${argId}`,{
      
    })
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => {
        return Promise.reject(error.response.data.message);
      })
  }
  else {
    return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team-player/`,{
      
    })
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => {
        return Promise.reject(error.response.data.message);
      })
  }
}

export const fetchUnassignedPlayers = async () => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/unassigned-players/`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const addTeamPlayer = async(argTeamId: number, argPlayerId: number) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/team-players/${argTeamId}`,{
    idPlayer: argPlayerId
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const removeTeamPlayer = async(argTeamPlayer: ITeamPlayers) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/team-player/`,{
    data:{
      teamId: argTeamPlayer.teamId,
      teamName: argTeamPlayer.teamName,
      playerId: argTeamPlayer.playerId,
      playerName: argTeamPlayer.playerName,
    }
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}