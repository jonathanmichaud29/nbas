import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../Firebase/firebase";

import PublicMenu from "../Menu/PublicMenu";

import { setDefaultAdminMetas } from '../utils/metaTags';

import { IApiSetUserFirebaseTokenParams, setUserFirebaseToken } from "../ApiCall/users";
import { updateAxiosBearer } from "../utils/axios";

function AdminApp() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const location = useLocation().pathname;
  
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
          .then(response => {
            if( location === '/admin/login'){
              navigate("/admin/dashboard");
            }
          })
          .catch(error => {
            window.localStorage.clear();
            updateAxiosBearer()
          })
      })
    }
    else {
      window.localStorage.clear();
      updateAxiosBearer();
      navigate("/admin/login");
    }
  }, [user, loading, navigate, location]);

  setDefaultAdminMetas();
  return (
    <>
      <PublicMenu />
      <Outlet />
    </>
  )
}
export default AdminApp;