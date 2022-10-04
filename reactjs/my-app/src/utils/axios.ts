import axios from 'axios';

import { getStorageLeagueId, getStorageUserToken } from './localStorage';

const axiosPublic = axios.create();
const axiosProtected = axios.create();

axiosProtected.interceptors.request.use(
  async (config) => {
    const userToken = getStorageUserToken();
    const idLeague = getStorageLeagueId();
    
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${userToken}`,
      idleague: idLeague
    };

    return config;
  },
  (error) => Promise.reject(error)
);

axiosPublic.interceptors.request.use(
  async (config) => {
    const userToken = getStorageUserToken();
    const idLeague = getStorageLeagueId();
    
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${userToken}`,
      idleague: idLeague
    };

    return config;
  },
  (error) => Promise.reject(error)
);
export { axiosPublic, axiosProtected}