import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, useLocation } from 'react-router-dom';

import { auth } from "../Firebase/firebase";

import { Avatar, Box, Button, Grid, List, ListItem, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { pink } from '@mui/material/colors';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';



import logo from '../assets/logo.jpg'
import './_publicMenu.scss';



function PublicMenu() {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  const { pathname } = location;
  console.log("location", location, "pathname", pathname);

  const renderPublicLinks = () => {
    const links = [
      {
        label:"Player Stats",
        url: "/stats/players",
      },
      {
        label:"Teams Stats",
        url: "/stats/teams",
      },
      {
        label:"Calendar",
        url: "/stats/calendar",
      }
    ];
    return links.map((link, index) => {
      return (
        <ListItem key={`public-menu-${index}`}><NavLink to={link.url}>{link.label}</NavLink></ListItem>
      )
    })
  }
  const renderUserLinks = () => {
    if( loading ) return;
    const links = ( user ? [
      {
        label:"User Profile",
        url: "/admin/dashboard",
      },
      {
        label:"Players",
        url: "/admin/players",
      },
      {
        label:"Teams",
        url: "/admin/teams",
      },
      {
        label:"Calendar",
        url: "/admin/calendar",
      },
    ]
    : [
      {
        label:"Login",
        url: "/admin/login",
      }
    ]);
    
    return links.map((link, index) => <MenuItem key={`user-menu-${index}`}><NavLink to={link.url}>{link.label}</NavLink></MenuItem>)
  }

  return (
    <Box id="header">
      <Grid container>
        <Grid item xs={2} className="logo">
          <NavLink to="/"><img src={logo} alt="Home" /></NavLink>
        </Grid>
        <Grid item xs={8} className="publicLinks">
          <List>
            { renderPublicLinks() }
          </List>
        </Grid>
        <Grid item xs={2} className="privateLinks">
          <PopupState variant="popover" popupId="popup-admin">
            {(popupState) => (
              <>
                <Button {...bindTrigger(popupState)}>
                  <Avatar sx={{ bgcolor: pink[500] }}>
                    <AccountCircleIcon />
                  </Avatar>
                </Button>
                <Menu {...bindMenu(popupState)}>
                  { renderUserLinks() }
                </Menu>
              </>
            )}
          </PopupState>
        </Grid>
      </Grid>
    </Box>
  )
}
export default PublicMenu;