import { useEffect, useState } from "react";
import { Outlet, useOutletContext }from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../redux/store";
import { addLeagues } from "../redux/leagueSlice";

import { auth } from "../Firebase/firebase";

import { IApiSetUserFirebaseTokenParams, setUserFirebaseToken } from "../ApiCall/users";
import { fetchLeagues, IApiFetchLeaguesParams } from "../ApiCall/leagues";

import PublicMenu from "../Menu/PublicMenu";

import { updateAxiosBearer } from "../utils/axios";

type TAdminData = {
  isAdmin:boolean
}

export function useAdminData() {
  return useOutletContext<TAdminData>()
}

function PublicApp() {
  const dispatch = useDispatch<AppDispatch>();

  const [user, loading] = useAuthState(auth);
  const [adminValidate, setAdminValidate] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<boolean>(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      user.getIdToken().then(token=>{
        window.localStorage.setItem('userToken', token);
        updateAxiosBearer()
        
        const paramsSetUserFirebaseToken: IApiSetUserFirebaseTokenParams = {
          email: user.email || '',
          token: token,
        }
        setUserFirebaseToken(paramsSetUserFirebaseToken)
          /* .then(response => {
            
          }) */
          .catch(error => {
            window.localStorage.clear();
            updateAxiosBearer()
          })
          .finally(() => {
            setAdminData(true)
            setAdminValidate(true);
          })
      })
    }
    else {
      window.localStorage.clear();
      updateAxiosBearer();
      setAdminValidate(true);
    }
  }, [user, loading]);

  useEffect(() => {
    const paramsFetchLeagues: IApiFetchLeaguesParams = {
      allLeagues:true
    }
    fetchLeagues(paramsFetchLeagues)
      .then(response => {
        dispatch(addLeagues(response.data));
      })
      .catch(error => {
        /* changeApiError(error); */
      })
      .finally(() => {
        /* setIsLeaguePlayersLoaded(true); */
      });
  }, [dispatch]);

  return (
    <>
      <PublicMenu />
      { adminValidate && (
        <Outlet 
          context={{
            isAdmin:adminData
          }} 
        />
      )}
    </>
  )
}
export default PublicApp;