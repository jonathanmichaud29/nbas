import { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink } from 'react-router-dom';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { auth } from "../Firebase/firebase";
import { usePublicContext } from '../Public/PublicApp';

import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, Link, List, ListItem, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { adminlistLinks, newlistLinks, quickLinkAdminHome, quickLinkHome, quickLinkLogin } from '../utils/constants';
import { replaceSeasonLink } from '../utils/linksGenerator';

function PublicMenu() {

  const {league, leagueSeason} = usePublicContext();
  
  const [user, loading] = useAuthState(auth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const availableAdminLinks = leagueSeason === null ? adminlistLinks.filter((link) => ! link.requireAdminSeason) : adminlistLinks;



  const renderPublicLinks = (isDrawer?:boolean) => {
    return newlistLinks.map((myLink, index) => {
      const myFullLink = replaceSeasonLink(myLink.link, leagueSeason?.id.toString());
      if( isDrawer ) {
        return (
          <ListItem key={`public-menu-${index}`} 
            sx={{
              padding:0,
              margin:'5px 0',
            }}
          >
            <Link 
              component={NavLink} 
              // to={leagueSeason ? myLink.link.replace(':idSeason', leagueSeason.id.toString()) : myLink.link} 
              to={myFullLink}
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
            >{myLink.label}</Link>
          </ListItem>
        )
      }
      else {
        return (
          <ListItem key={`public-menu-${index}`}>
            <Link 
              component={NavLink} 
              to={myFullLink}
              // to={leagueSeason ? myLink.link.replace(':idSeason', leagueSeason.id.toString()) : myLink.link} 
              sx={{ 
                color:(theme) => theme.palette.primary.light,
                textAlign: 'center',
                whiteSpace:'nowrap',
              }}
            >{myLink.label}</Link>
          </ListItem>
        )
      }
    })
  }
  
  const getAdminLinks = () => {
    if( loading ) return [];
    return ( user ? availableAdminLinks.map((adminLink) => {
      return {
        label: adminLink.label,
        url: adminLink.link.replace(':idSeason', leagueSeason?.id.toString() || ''),
      }
    }) : [
      {
        label:quickLinkLogin.label,
        url: quickLinkLogin.link,
      }
    ] );
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
          { league ? 
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          : ''}

          <Link href="/" variant="h6" color="inherit" style={{textDecoration:'none'}}>
            JLM BB
          </Link>
        </Box>

        { league ? 
          <List sx={{
            display:{xs:'none', sm:'flex'},
            flexFlow: 'row nowrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            { renderPublicLinks() }
          </List>
        : '' }

        <PopupState variant="popover" popupId="popup-admin">
          {(popupState) => (
            <>
              <Button {...bindTrigger(popupState)}>
                <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main }}>
                  <AccountCircleIcon />
                </Avatar>
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem key={`admin-menu-public`}>
                  <Link 
                    component={NavLink} 
                    to={quickLinkHome.link}
                    onClick={popupState.close}
                  >{quickLinkHome.label}</Link>
                </MenuItem>
                <MenuItem key={`admin-menu-admin`}>
                  <Link 
                    component={NavLink} 
                    to={quickLinkAdminHome.link}
                    onClick={popupState.close}
                  >{quickLinkAdminHome.label}</Link>
                </MenuItem>
                { getAdminLinks().map((link, index) => (
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