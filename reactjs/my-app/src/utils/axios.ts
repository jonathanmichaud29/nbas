import axios from 'axios';
import { castNumber } from './castValues';

const axiosPublic = axios.create();
const axiosProtected = axios.create();

const userToken = window.localStorage.getItem("userToken");
if( userToken !== null){
  axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
}

const idLeague = castNumber(window.localStorage.getItem("currentLeagueId"));
axiosProtected.defaults.headers.post['idleague'] = idLeague;

export const updateAxiosBearer = () => {
  const userToken = window.localStorage.getItem("userToken");
  axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${userToken || ''}`;
  axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken || ''}`;

  const idLeague = castNumber(window.localStorage.getItem("currentLeagueId"));
  axiosProtected.defaults.headers.post['idleague'] = idLeague;
}

export { axiosPublic, axiosProtected }