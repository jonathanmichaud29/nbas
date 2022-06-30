import { Outlet }from "react-router-dom"

import PublicMenu from "../Menu/PublicMenu";

import { setDefaultAdminMetas } from '../utils/metaTags';

function AdminApp() {
  setDefaultAdminMetas();
  return (
    <div className="public-layout">
      <PublicMenu />
      <Outlet />
    </div>
  )
}
export default AdminApp;