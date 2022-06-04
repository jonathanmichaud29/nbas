import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase/firebase";
import { Link } from 'react-router-dom';

import { List, ListItem  } from "@mui/material";

function PublicMenu() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
  }, [user, loading]);

  const renderPublicLinks = () => {
    if( ! loading && ! user ) {
      return (
        <ListItem><Link to="/admin/login">Login</Link></ListItem>
      )
    }
  }

  const renderAdminLinks = () => {
    if( ! loading && user ) {
      return (
        <>
          <ListItem><Link to="/admin/dashboard">Dashboard</Link></ListItem>
          <ListItem><Link to="/admin/teams">Teams</Link></ListItem>
          <ListItem><Link to="/admin/players">Players</Link></ListItem>
          <ListItem><Link to="/admin/calendar">Calendar</Link></ListItem>
        </>
      )
    }
  }

  return (
    <div className="main-menu">
      <List dense={true}>
        <ListItem><Link to="/">Home</Link></ListItem>
        { renderPublicLinks() }
        { renderAdminLinks() }

        
      </List>
    </div>
  )
}
export default PublicMenu;