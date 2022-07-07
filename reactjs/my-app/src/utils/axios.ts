import axios from 'axios';

const axiosPublic = axios.create();
const axiosProtected = axios.create();

const userToken = window.localStorage.getItem("userToken");
if( userToken !== null){
  axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
}

export const updateAxiosBearer = () => {
  const userToken = window.localStorage.getItem("userToken");
  axiosPublic.defaults.headers.common['Authorization'] = `Bearer ${userToken || ''}`;
  axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken || ''}`;
}

export { axiosPublic, axiosProtected }