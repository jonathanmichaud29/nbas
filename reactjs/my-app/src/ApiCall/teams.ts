import axios from 'axios';

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
  return await axios.post(`${process.env.REACT_APP_API_DOMAIN}/team/`,{
    name: argName
  })
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export { fetchTeam, fetchTeams, createTeam }