import { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, useOutletContext } from 'react-router-dom';

import { auth } from "../Firebase/firebase";

import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, Link, List, ListItem, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

export default function AdminMenu() {

  const [user, loading] = useAuthState(auth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);


  const renderPublicLinks = (isDrawer?:boolean) => {
    if( isDrawer ) {
      return (
        <ListItem key={`public-menu`} 
          sx={{
            padding:0,
            margin:'5px 0',
          }}
        >
          <Link 
            component={NavLink} 
            to={`/`} 
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
          >Public site</Link>
        </ListItem>
      )
    }
    else {
      return (
        <ListItem key={`public-menu`}>
          <Link 
            component={NavLink} 
            to={`/`} 
            sx={{ 
              color:(theme) => theme.palette.primary.light,
              textAlign: 'center',
              whiteSpace:'nowrap',
            }}
          >Public site</Link>
        </ListItem>
      )
    }
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
            JLM BB
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