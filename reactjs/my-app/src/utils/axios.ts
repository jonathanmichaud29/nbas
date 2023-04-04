import axios from 'axios';

import { getStorageLeagueId, getStorageLeagueSeasonId, getStorageUserToken } from './localStorage';

const axiosPublic = axios.create();
const axiosProtected = axios.create();

axiosProtected.interceptors.request.use(
  async (config) => {
    const userToken = getStorageUserToken();
    const idLeague = getStorageLeagueId();
    const idLeagueSeason = getStorageLeagueSeasonId();
    
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${userToken}`,
      idleague: idLeague,
      idseason: idLeagueSeason,
    };

    return config;
  },
  (error) => Promise.reject(error)
);
/* 
axiosProtected.interceptors.response.use(
  (response) => {
    return response;
  },
  async(error) => {
    const originalConfig = error.config;
    if (error.response && error.response.status === 401 && !originalConfig._retry) {
      // Call refresh token

      return axiosProtected(originalConfig);
    }
  }
); */

axiosPublic.interceptors.request.use(
  async (config) => {
    const userToken = getStorageUserToken();
    const idLeague = getStorageLeagueId();
    const idLeagueSeason = getStorageLeagueSeasonId();
    
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${userToken}`,
      idleague: idLeague,
      idseason: idLeagueSeason,
    };

    return config;
  },
  (error) => Promise.reject(error)
);


export { axiosPublic, axiosProtected}