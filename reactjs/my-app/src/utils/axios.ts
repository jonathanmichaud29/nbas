import axios from 'axios';

import { getStorageLeagueId, getStorageLeagueSeasonId, getStorageUserToken } from './localStorage';
import { useLocation } from 'react-router-dom';
import { useAdminContext } from '../Admin/AdminApp';

const axiosPublic = axios.create();
const axiosProtected = axios.create();

axiosProtected.interceptors.request.use(
  async (config) => {
    const userToken = getStorageUserToken();
    
    const idLeague = getStorageLeagueId();
    const idLeagueSeason = getStorageLeagueSeasonId();
    
    config.headers.Authorization = `Bearer ${userToken}`
    config.headers.idleague = idLeague
    config.headers.idseason = idLeagueSeason
    

    return config;
  },
  (error) => Promise.reject(error)
);

axiosPublic.interceptors.request.use(
  async (config) => {
    const userToken = getStorageUserToken();
    const idLeague = getStorageLeagueId();
    const idLeagueSeason = getStorageLeagueSeasonId();

    config.headers.Authorization = `Bearer ${userToken}`
    config.headers.idleague = idLeague
    config.headers.idseason = idLeagueSeason

    return config;
  },
  (error) => Promise.reject(error)
);


export { axiosPublic, axiosProtected}