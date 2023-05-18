import { useEffect } from 'react';

import { usePublicContext } from './PublicApp';

import Breadcrumb from '../Menu/Breadcrumb';
import PublicMenu from '../Menu/PublicMenu';
import SeasonMatches from '../Matchs/SeasonMatches';

import { setMetas } from '../utils/metaTags';

function PublicCalendar() {
  
  const { league, leagueSeason } = usePublicContext();

  useEffect(() =>{
    setMetas({
      title:`${leagueSeason.name} Calendar for ${league.name} league`,
      description:`${league.name} ${leagueSeason.name} calendar`
    });
  },[league.name, leagueSeason.name])

  return (
    <>
      <PublicMenu />
      <Breadcrumb />
      
      <SeasonMatches />
    </>
  )
}
export default PublicCalendar;