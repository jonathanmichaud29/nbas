import { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink } from 'react-router-dom';

import { auth } from "../Firebase/firebase";

import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, Link, List, ListItem, Menu, MenuItem, Typography } from "@mui/material";
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
        url: "/calendar",
      },
      {
        label:"Compare",
        url: "/stats/compare",
      }
    ];

    return links.map((link, index) => {
      if( isDrawer ) {
        return (
          <ListItem key={`public-menu-${index}`} sx={{
            padding:0,
            margin:'5px 0',
          }}>
            <Link 
              component={NavLink} 
              to={link.url} 
              onClick={() => setMobileMenuOpen(false)}
              p={1} 
              sx={{
                display:'block',
                width:'100%',
                textAlign:'center',
                '&:hover':{
                  color:(theme) => theme.palette.primary.light,
                  backgroundColor:(theme) => theme.palette.primary.main,
                  textDecoration:"none",
                }
              }}
            >{link.label}</Link>
          </ListItem>
        )
      }
      else {
        return (
          <ListItem key={`public-menu-${index}`}>
            <Link 
              component={NavLink} 
              to={link.url} 
              sx={{ 
                color:(theme) => theme.palette.primary.light,
                textAlign: 'center',
                whiteSpace:'nowrap',
              }}
            >{link.label}</Link>
          </ListItem>
        )
      }
    })
  }
  
  const getUserLinks = () => {
    if( loading ) return [];
    return ( user ? [
      {
        label:"Dashboard",
        url: "/admin/dashboard",
      },
      {
        label:"Leagues",
        url: "/admin/leagues",
      },
      {
        label:"Seasons",
        url: "/admin/seasons",
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
                { getUserLinks().map((link, index) => (
                  <MenuItem key={`user-menu-${index}`}>
                    <Link 
                      component={NavLink} 
                      to={link.url}
                      onClick={popupState.close}
                    >{link.label}</Link>
                  </MenuItem>
                ))}
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
        <Box sx={{
            textAlign:"center",
            backgroundColor:(theme) => theme.palette.primary.main,
            color:(theme) => theme.palette.primary.light
          }}
        >
          <Typography variant="h6" m={1} >NBAS Main Menu</Typography>
        </Box>
        <Divider />
        <List sx={{
          display:"flex",
          flexFlow:"column nowrap",
        }}>
          { renderPublicLinks(true) }
        </List>
      </Drawer>
    </>
  )
}

export default PublicMenu;