import { axiosPublic, axiosProtected } from '../utils/axios'

export const fetchPlayer = async (id: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/player/${id}`)
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

export const fetchPlayers = async () => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/player/`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const fetchSpecificPlayers = async(listIds: Array<number>) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/player/list/`, {
    listIds: listIds
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export const createPlayer = async (argName: string) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/player/`,{
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
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/player/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
