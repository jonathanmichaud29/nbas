import { useLocation } from "react-router-dom"

import { Box, Breadcrumbs, Link, Paper, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

import { useAdminContext } from "../Admin/AdminApp";

import { adminlistLinks, quickLinkAdminHome } from "../utils/constants";


export default function AdminBreadcrumb(){
  const location = useLocation();

  const {league, leagueSeason} = useAdminContext();
  
  let currentLink = '';
  const crumbs = location.pathname.split('/')
    .filter((crumb) => crumb !== '' && crumb !== 'admin')
    .map((crumb, index) => {
      currentLink += `/${crumb}`;
      if( index === 0 ){
        return {
          link: currentLink,
          label: ( league && leagueSeason ? `${league.name} - ${leagueSeason.name}` : 'Undefined League' )
        }
      }
      const myLink = adminlistLinks.find((listLink) => listLink.link === `/${crumb}`)
      if( myLink ){
        return {
          link: currentLink,
          label: myLink.label
        }
      }
      return {
        link: currentLink,
        label: crumb
      }
    })

  

  return (
    <>
      { crumbs.length > 0 ? (
        <Paper component={Box} p={1} sx={{borderRadius:0}}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Link 
              key={`breadcrumb-home`} 
              href={quickLinkAdminHome.link} 
              sx={{
                display:'flex'
              }}
            >
              <HomeIcon fontSize="small" />
            </Link>
            {crumbs.map((crumb, index) => {
              if( index < crumbs.length - 1) {
                return <Link key={`breadcrumb-${index}`} href={crumb.link}>{crumb.label}</Link>
              }
              else {
                return <Typography key={`breadcrumb-${index}`}>{crumb.label}</Typography>
              }
            })}
          </Breadcrumbs>
        </Paper>
      ) : ''}
    </>
  )
}