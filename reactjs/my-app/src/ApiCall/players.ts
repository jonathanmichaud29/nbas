import { axiosPublic, axiosProtected } from '../utils/axios'

const fetchPlayers = async () => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/player/`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const createPlayer = async (argName: string) => {
  
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

const deletePlayer = async (argId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/player/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export { createPlayer, deletePlayer, fetchPlayers }