import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../Firebase/firebase";

import PublicMenu from "../Menu/PublicMenu";

import { setDefaultAdminMetas } from '../utils/metaTags';

import { IApiSetUserFirebaseTokenParams, setUserFirebaseToken } from "../ApiCall/users";
import { getStorageLeagueId, getStorageLeagueSeasonId } from "../utils/localStorage";
import ChangeAdminLeague from "../League/ChangeAdminLeague";

function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [user, loading] = useAuthState(auth);
  const [dataRetrieved, setDataRetrieved] = useState<boolean>(false);
  
  useEffect(() => {
    if( getStorageLeagueId() === 0 && location !== '/admin/dashboard'){
      navigate('/admin/dashboard');
    }
  },[location, navigate])
  
  useEffect(() => {
    if (loading) return;
    if (user) {
      user.getIdToken().then(token=>{
        window.localStorage.setItem('userToken', token);

        const paramsSetUserFirebaseToken: IApiSetUserFirebaseTokenParams = {
          email: user.email || '',
          token: token,
        }
        setUserFirebaseToken(paramsSetUserFirebaseToken)
          .then(response => {
            if( location === '/admin/login'){
              navigate("/admin/dashboard");
            }
          })
          .catch(error => {
            window.localStorage.clear();
          })
          .then(() => {
            setDataRetrieved(true);
          })
      })
    }
    else {
      window.localStorage.clear();
      navigate("/admin/login");
    }
  }, [user, loading, navigate, location]);

  setDefaultAdminMetas();
  return (
    <>
      <PublicMenu />
      {dataRetrieved && (
        <ChangeAdminLeague />
      )}
      <Outlet />
    </>
  )
}
export default AdminApp;