import { Outlet }from "react-router-dom"

import PublicMenu from "../Menu/PublicMenu";

function PublicApp() {
  return (
    <div className="public-layout">
      <PublicMenu />
      <Outlet />
    </div>
  )
}
export default PublicApp;