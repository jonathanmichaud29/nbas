import { IMatch } from '../Interfaces/match';
import { IPlayerLineupStats } from '../Interfaces/stats';
import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchMatchesParams {
  matchIds?       : Array<number>;
  quantity?       : number;
  isPast?         : boolean;
  isUpcoming?     : boolean;
  valueCompleted? : number;
  leagueIds?      : Array<number>;
  isIgnoringLeague?: boolean;
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
  leagueId?: number;
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


export interface IApiFetchMatchLineups {
  allLineups?: boolean;
  matchId?: number;
  teamId?: number;
  teamIds?: Array<number>;
  playerIds?: Array<number>;
  leagueIds?: Array<number>;
}
export const fetchMatchLineups = async(bodyParams: IApiFetchMatchLineups) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/match-lineup/`, bodyParams)
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

export interface IApiCreateMatchParams {
  teamHomeId: number;
  teamAwayId: number;
  date: Date;
}
export const createMatch = async (bodyParams: IApiCreateMatchParams) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/match/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiDeleteMatchParams {
  matchId: number;
}
export const deleteMatch = async (bodyParams: IApiDeleteMatchParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/match/${bodyParams.matchId}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}


export interface IApiUpdateMatchLineupParams {
  match: IMatch;
  playersLineupsStats: Array<IPlayerLineupStats>;
}
export const updateMatchLineup = async(bodyParams: IApiUpdateMatchLineupParams) => {
  return await axiosProtected.put(`${process.env.REACT_APP_API_DOMAIN}/m/match-lineup/`,{
    match: bodyParams.match,
    playersLineupsStats: bodyParams.playersLineupsStats,
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiAddMatchLineupsParams {
  matchId: number;
  teamId: number;
  playerIds: Array<number>;
}
export const addMatchLineups = async(bodyParams: IApiAddMatchLineupsParams) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/match-lineup/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiDeleteMatchLineupParams {
  matchLineupId: number;
}
export const deleteMatchLineup = async(bodyParams: IApiDeleteMatchLineupParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/match-lineup/${bodyParams.matchLineupId}`)
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



/* export const addLineupPlayers = async(argMatchId: number, argTeamId: number, argPlayerIds: Array<number>) => {
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
} */



