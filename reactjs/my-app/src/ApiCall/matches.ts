import { axiosPublic, axiosProtected } from '../utils/axios'

const fetchMatches = async () => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/match/`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const fetchMatch = async (id: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/match/${id}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const createMatch = async (argTeamHome: number, argTeamAway: number, argDate: Date) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/match/`,{
    idTeamHome: argTeamHome,
    idTeamAway: argTeamAway,
    date: argDate,
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const deleteMatch = async (argId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/match/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const fetchMatchLineups = async(argId: number) => {
  return await axiosProtected.get(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/${argId}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const addMatchLineup = async(argMatchId: number, argTeamId: number, argPlayerId: number) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/player/${argMatchId}`, {
    idTeam: argTeamId,
    idPlayer: argPlayerId
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const deletePlayerLineup = async(argLineupId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/player/${argLineupId}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}


export { createMatch, deleteMatch, fetchMatches, fetchMatch, fetchMatchLineups, addMatchLineup, deletePlayerLineup }