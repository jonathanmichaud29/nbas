import { ITeamPlayers } from '../Interfaces/Team';
import { axiosPublic, axiosProtected } from '../utils/axios'

export const fetchTeam = async (idTeam: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team/${idTeam}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const fetchTeams = async (argIds?: Array<number>) => {
  if( argIds ){
    return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/team/list/`, {
      listIds: argIds
    })
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => {
        return Promise.reject(error.response.data.message);
      })
  }
  else {
    return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team/`)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => {
        return Promise.reject(error.response.data.message);
      })
  }
  
}

export const fetchTeamHistoryMatches = async (id: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team-matches/${id}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const createTeam = async (argName: string) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/team/`,{
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
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/team/${argId}`,{
    
  })
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