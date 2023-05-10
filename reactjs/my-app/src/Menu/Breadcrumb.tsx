import { useLocation } from "react-router-dom"

import { Box, Breadcrumbs, Link, Paper, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

import { newlistLinks } from "../utils/constants";



export default function Breadcrumb(){
  const location = useLocation();

  let currentLink = '';
  const crumbs = location.pathname.split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink += `/${crumb}`;
      const myLink = newlistLinks.filter((listLink) => listLink.link === `/${crumb}`)[0]
      return {
        link: currentLink,
        label: myLink.label
      }
    })

  

  return (
    <>
      { crumbs.length > 0 ? (
        <Paper component={Box} p={1} pt={2} sx={{borderRadius:0}}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Link 
              key={`breadcrumb-home`} 
              href="/" sx={{
                display:'flex'
              }}
            >
              <HomeIcon fontSize="small" />
              Home
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