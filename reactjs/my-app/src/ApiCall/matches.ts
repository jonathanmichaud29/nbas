import { axiosPublic, axiosProtected } from '../utils/Axios'

const fetchMatches = async () => {
  return await axiosPublic.get(`${process.env.REACT_APP_API_DOMAIN}/match/`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const createMatch = async (argTeamHome: number, argTeamAway: number, argDate: Date) => {
  
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/match/`,{
    id_team_home: argTeamHome,
    id_team_away: argTeamHome,
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

export { createMatch, deleteMatch, fetchMatches }