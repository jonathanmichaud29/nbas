import { castNumber } from "../utils/castValues";

/**
 * Public Data
 */
export const getStoragePublicLeagueId = () => {
  return castNumber(window.localStorage.getItem("publicLeagueId"))
}
export const setStoragePublicLeagueId = (id:number) => {
  return window.localStorage.setItem("publicLeagueId", id.toString());
}

/**
 * Admin data
 */
export const getStorageLeagueId = () => {
  return castNumber(window.localStorage.getItem("currentLeagueId"))
}

export const getStorageLeagueName = () => {
  return window.localStorage.getItem("currentLeagueName")
}

export const getStorageUserToken = () => {
  return window.localStorage.getItem("userToken");
}