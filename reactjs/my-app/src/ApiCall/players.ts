import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */

export interface IApiFetchPlayersParams {
  playerIds?: Array<number>;
  allPlayers?: boolean;
}
export const fetchPlayers = async (bodyParams: IApiFetchPlayersParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/player/`,bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const fetchPlayerHistoryMatches = async (id: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/player-matches/${id}`)
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


export const createPlayer = async (argName: string) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/player/`,{
    name: argName
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const deletePlayer = async (argId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/m/player/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
