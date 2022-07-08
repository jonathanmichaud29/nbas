import { axiosPublic, axiosProtected } from '../utils/axios'

/**
 * Public calls
 */


/**
 * Protected calls
 */

 export interface IApiSetUserFirebaseUidParams {
  email: string;
  uid: string;
}
export const setUserFirebaseUid = async (bodyParams: IApiSetUserFirebaseUidParams) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/user/fbuid/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}

export interface IApiSetUserFirebaseTokenParams {
  token: string;
  email: string;
}
export const setUserFirebaseToken = async (bodyParams: IApiSetUserFirebaseTokenParams) => {
  return await axiosProtected.post(`${process.env.REACT_APP_API_DOMAIN}/m/user-token/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}


export interface IApiFetchUserLeaguesParams {
}
export const fetchUserLeagues = async (bodyParams: IApiFetchUserLeaguesParams) => {
  return await axiosPublic.post(`${process.env.REACT_APP_API_DOMAIN}/r/user-leagues/`, bodyParams)
    .then(response => {
      return Promise.resolve(response.data);
    })
    .catch(error => {
      return Promise.reject(error.response.data.message);
    })
}