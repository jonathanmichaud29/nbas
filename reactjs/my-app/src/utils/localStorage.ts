import { castNumber } from "../utils/castValues";

export const getStorageLeagueId = () => {
  return castNumber(window.localStorage.getItem("currentLeagueId"))
}

export const getStorageLeagueName = () => {
  return window.localStorage.getItem("currentLeagueName")
}

export const getStorageUserToken = () => {
  return window.localStorage.getItem("userToken");
}