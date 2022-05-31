import { axiosPublic, axiosProtected } from '../utils/Axios'

const fetchTeam = async (id_team: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team/${id_team}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const fetchTeams = async () => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team/`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const createTeam = async (argName: string) => {
  
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

const deleteTeam = async (argId: number) => {
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/team/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const fetchTeamPlayers = async (argId: number) => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/team-players/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
export { fetchTeam, fetchTeams, createTeam, deleteTeam, fetchTeamPlayers }