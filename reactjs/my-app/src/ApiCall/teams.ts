import axios from 'axios';

const fetchTeams = async () => {
  return await axios.get(`${process.env.REACT_APP_API_DOMAIN}/team/`)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export { fetchTeams }