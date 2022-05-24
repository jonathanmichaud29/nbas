import { Outlet }from "react-router-dom"

import PublicMenu from "../Menu/PublicMenu";

function PublicApp() {
  return (
    <div className="public-layout">
      <h1>Public App</h1>
      <PublicMenu />
      <Outlet />
    </div>
  )
}
export default PublicApp;