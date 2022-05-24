import React from "react";
import { Outlet }from "react-router-dom"
import PublicMenu from "../Menu/PublicMenu";
function AdminApp() {
  return (
    <div className="public-layout">
      <h1>Admin App</h1>
      <PublicMenu />
      <Outlet />
    </div>
  )
}
export default AdminApp;