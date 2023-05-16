interface ILinks {
  id: string;
  link : string;
  label: string;
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