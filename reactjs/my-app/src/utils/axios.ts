import axios from 'axios';

import { getStorageLeagueId, getStorageUserToken } from './localStorage';

const axiosPublic = axios.create();
const axiosProtected = axios.create();

const userToken = getStorageUserToken();
if( userToken !== null){
  axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
}

const idLeague = getStorageLeagueId();
if( idLeague !== 0 ){
  axiosPublic.defaults.headers.post['idleague'] = idLeague;
  axiosProtected.defaults.headers.post['idleague'] = idLeague;
  axiosProtected.defaults.headers.delete['idleague'] = idLeague;
}

export const updateAxiosBearer = () => {
  // Firebase User Token
  const userToken = getStorageUserToken();
  axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${userToken || ''}`;
  axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken || ''}`;

  // Current League
  const idLeague = getStorageLeagueId();
  axiosPublic.defaults.headers.post['idleague'] = idLeague;
  axiosProtected.defaults.headers.post['idleague'] = idLeague;
  axiosProtected.defaults.headers.delete['idleague'] = idLeague;
}

export { axiosPublic, axiosProtected }