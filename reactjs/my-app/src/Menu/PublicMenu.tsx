import { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink } from 'react-router-dom';

import { auth } from "../Firebase/firebase";

import { AppBar, Avatar, Box, Button, Drawer, IconButton, Link, List, ListItem, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

function PublicMenu() {
  
  const [user, loading] = useAuthState(auth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);


  const renderPublicLinks = (isDrawer?:boolean) => {
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
        <ListItem key={`public-menu-${index}`}>
          <Link component={NavLink} to={link.url} sx={{ 
            color:(theme) => isDrawer ? theme.palette.primary.main : theme.palette.primary.light,
            textAlign: 'center',
            whiteSpace:'nowrap'
          }}
          >{link.label}</Link>
        </ListItem>
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
    
    return links.map((link, index) => (
      <MenuItem key={`user-menu-${index}`}>
        <Link component={NavLink} to={link.url}>{link.label}</Link>
      </MenuItem>
    ))
  }

  
  return (
    <>
      <AppBar 
        position="static"
        sx={{
          display:'flex',
          flexFlow: 'row nowrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: '1',
          padding:'10px',
        }}
      >
        <Box sx={{
          display:'flex',
          flexFlow: 'row nowrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Link href="/" variant="h6" color="inherit" style={{textDecoration:'none'}}>
            NBAS League
          </Link>
        </Box>
        <List sx={{
          display:{xs:'none', sm:'flex'},
          flexFlow: 'row nowrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          { renderPublicLinks() }
        </List>
        <PopupState variant="popover" popupId="popup-admin">
          {(popupState) => (
            <>
              <Button {...bindTrigger(popupState)}>
                <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main }}>
                  <AccountCircleIcon />
                </Avatar>
              </Button>
              <Menu {...bindMenu(popupState)}>
                { renderUserLinks() }
              </Menu>
            </>
          )}
        </PopupState>
        
      </AppBar>

      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        variant='temporary'
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx:{
            width:'75%',
            maxWidth:'300px'
          }
        }}
      >
        <List>
          { renderPublicLinks(true) }
        </List>
      </Drawer>
    </>
  )
}

export default PublicMenu;