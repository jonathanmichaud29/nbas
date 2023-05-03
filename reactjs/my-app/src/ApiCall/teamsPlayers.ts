import { axiosPublic, axiosProtected } from '../utils/axios'


/**
 * Public calls
 */

export interface IApiFetchTeamsPlayersParams {
  isAdminContext?: boolean;
  playerIds?: Array<number>;
  teamIds?: Array<number>;
  allTeamsPlayers?: boolean;
  leagueIds?:Array<number>;
  leagueSeasonIds?:Array<number>;
}
export const fetchTeamsPlayers = async (bodyParams: IApiFetchTeamsPlayersParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/team-player/`, bodyParams)
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

export interface IApiAddTeamPlayerParams {
  teamId: number;
  playerId: number;
}
export const addTeamPlayer = async(bodyParams: IApiAddTeamPlayerParams) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/team-player/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiDeleteTeamPlayerParams {
  teamId: number;
  playerId: number;
}
export const deleteTeamPlayer = async(bodyParams: IApiDeleteTeamPlayerParams) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/team-player/${bodyParams.teamId}/${bodyParams.playerId}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}


export const fetchUnassignedPlayers = async () => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/team-player/unassigned/`,)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

