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

export const getStoragePublicLeagueSeasonId = () => {
  return castNumber(window.localStorage.getItem("publicLeagueSeasonId"))
}
export const setStoragePublicLeagueSeasonId = (id:number) => {
  return window.localStorage.setItem("publicLeagueSeasonId", id.toString());
}


/**
 * Admin data
 */
export const getStorageLeagueId = () => {
  return castNumber(window.localStorage.getItem("currentLeagueId"))
}
export const getStorageLeagueSeasonId = () => {
  return castNumber(window.localStorage.getItem("currentLeagueSeasonId"))
}

// TODO : Remove this call and instead use Redux storage for context (admin or public)
export const getStorageLeagueName = () => {
  return window.localStorage.getItem("currentLeagueName")
}
// TODO : Remove this call and instead use Redux storage for context (admin or public)
export const getStorageLeagueSeasonName = () => {
  return window.localStorage.getItem("currentLeagueSeasonName")
}

export const getStorageUserToken = () => {
  return window.localStorage.getItem("userToken");
}