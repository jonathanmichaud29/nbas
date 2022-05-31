import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase/firebase";

import { Link } from 'react-router-dom';

function PublicMenu() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
  }, [user, loading]);

  const renderPublicLinks = () => {
    if( ! loading && ! user ) {
      return (
        <li><Link to="/admin/login">Login</Link></li>
      )
    }
  }

  const renderAdminLinks = () => {
    if( ! loading && user ) {
      return (
        <>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/teams">Teams</Link></li>
          <li><Link to="/admin/players">Players</Link></li>
        </>
      )
    }
  }

  return (
    <div className="main-menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        { renderPublicLinks() }
        { renderAdminLinks() }

        
      </ul>
    </div>
  )
}
export default PublicMenu;