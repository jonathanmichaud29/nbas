import { IMatchTimeline } from "../Interfaces/match";

export const listMatchTimeline:IMatchTimeline[] = [
  {key:'all', label:'All'},
  {key:'past', label: "Past"},
  {key:'upcoming', label: "Upcoming"}
];

interface ILinks {
  id: string;
  link : string;
  label: string;
  requireAdminSeason?: boolean;
}

export const quickLinkHome: ILinks = {
  id:'home',
  link: '/',
  label : 'Public Site'
}
export const quickLinkAdminHome = {
  id:'adminHome',
  link: '/admin/',
  label : 'Admin Home',
}
export const quickLinkLogin: ILinks = {
  id:'adminlogin',
  link: '/admin/login',
  label : 'Login'
}

export const newlistLinks: ILinks[] = [
  {
    id:'player',
    link: '/:idSeason/players',
    label : 'Player Stats'
  },
  {
    id:'team',
    link: '/:idSeason/teams',
    label : 'Team Stats'
  },
  {
    id:'match',
    link: '/:idSeason/matches',
    label : 'Calendar'
  },
  {
    id:'compare',
    link: '/:idSeason/compare',
    label : 'Compare'
  },
  
];

export const quickLinkPlayer = newlistLinks.filter((link) => link.id === 'player')[0]
export const quickLinkTeam = newlistLinks.filter((link) => link.id === 'team')[0]
export const quickLinkMatch = newlistLinks.filter((link) => link.id === 'match')[0]
export const quickLinkCompare = newlistLinks.filter((link) => link.id === 'compare')[0]

export const adminlistLinks: ILinks[] = [
  {
    id:'league',
    link: '/admin/:idSeason',
    label : 'Leagues',
    requireAdminSeason: true
  },
  {
    id:'team',
    link: '/admin/:idSeason/teams',
    label : 'Team',
    requireAdminSeason: true
  },
  {
    id:'player',
    link: '/admin/:idSeason/players',
    label : 'Players',
    requireAdminSeason: true
  },
  {
    id:'calendar',
    link: '/admin/:idSeason/match',
    label : 'Calendar',
    requireAdminSeason: true
  },
  
];

export const quickLinkAdminPlayer = adminlistLinks.filter((link) => link.id === 'player')[0]
export const quickLinkAdminTeam = adminlistLinks.filter((link) => link.id === 'team')[0]
export const quickLinkAdminMatch = adminlistLinks.filter((link) => link.id === 'match')[0]
export const quickLinkAdminCalendar = adminlistLinks.filter((link) => link.id === 'calendar')[0]
export const quickLinkAdminLeague = adminlistLinks.filter((link) => link.id === 'league')[0]

