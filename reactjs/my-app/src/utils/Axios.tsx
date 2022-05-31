import axios from 'axios';

const axiosPublic = axios.create();
const axiosProtected = axios.create();
const userToken = window.localStorage.getItem("userToken");
axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

export { axiosPublic, axiosProtected }