import { IMatch } from '../Interfaces/match';
import { IPlayerLineupStats } from '../Interfaces/stats';
import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchMatchesParams {
  matchIds?: Array<number>;
  quantity?: number;
  isPast?: boolean;
  isUpcoming?: boolean;
  valueCompleted?: number;
}
export const fetchMatches = async (bodyParams: IApiFetchMatchesParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/match/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiFetchHistoryMatchesParams {
  teamId?: number;
  playerId?: number;
}
export const fetchHistoryMatches = async (bodyParams: IApiFetchHistoryMatchesParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/history-matches/`, bodyParams)
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







/**
 * Uncleaned calls
 */

export const createMatch = async (argTeamHome: number, argTeamAway: number, argDate: Date) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/match/`,{
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

export const deleteMatch = async (argId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/match/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const fetchMatchLineups = async(argId: number, argTeamId?: number) => {
  let bodyParams = Object();
  if( argTeamId ){
    bodyParams.idTeam = argTeamId;
  }
  return await axiosProtected.get(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/${argId}`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const fetchTeamMatchLineups = async(argId: number, argTeamId: number) => {
  return await axiosProtected.get(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/${argId}/${argTeamId}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const fetchMatchesLineups = async() => {
  return await axiosProtected.get(`${process.env.REACT_APP_API_DOMAIN}/matches-lineups/`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const fetchPlayersMatchLineups = async(argPlayerIds: Array<number>) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/players-lineups/`,{
    listPlayerIds: argPlayerIds
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const addMatchLineup = async(argMatchId: number, argTeamId: number, argPlayerId: number) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/player/${argMatchId}`, {
    idTeam: argTeamId,
    idPlayers: [argPlayerId]
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const addLineupPlayers = async(argMatchId: number, argTeamId: number, argPlayerIds: Array<number>) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/player/${argMatchId}`, {
    idTeam: argTeamId,
    idPlayers: argPlayerIds
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const deletePlayerLineup = async(argLineupId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/player/${argLineupId}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}


export const updateMatchLineup = async(argMatch: IMatch, argLineups: IPlayerLineupStats[]) => {
  return await axiosProtected.put(`${process.env.REACT_APP_API_DOMAIN}/match-lineup/${argMatch.id}`,{
    match: argMatch,
    lineups: argLineups
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
