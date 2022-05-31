import axios from 'axios';

const userToken = window.localStorage.getItem("userToken");
const axiosProtected = axios.create();
axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

const fetchTeam = async (id_team: number) => {
  return await axios.get(`${process.env.REACT_APP_API_DOMAIN}/team/${id_team}`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

const fetchTeams = async () => {
  return await axios.get(`${process.env.REACT_APP_API_DOMAIN}/team/`)
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
  console.info("deleteTeam #", argId);
  return await axiosProtected.delete(`${process.env.REACT_APP_API_DOMAIN}/team/${argId}`,{
    
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}
export { fetchTeam, fetchTeams, createTeam, deleteTeam }