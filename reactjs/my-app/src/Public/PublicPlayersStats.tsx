import { usePublicContext } from './PublicApp';

import PlayersBattingStats from '../Players/PlayersBattingStats';
import Breadcrumb from '../Menu/Breadcrumb';
import PublicMenu from '../Menu/PublicMenu';
import { setMetas } from '../utils/metaTags';


function PublicPlayersStats() {

  const { league, leagueSeason } = usePublicContext();

  setMetas({
    title:`${league.name} Players batting statistics - ${leagueSeason.name} `,
    description:`${league.name} players batting statistics for season ${leagueSeason.name}`
  });
  
  return (
    <>
      <PublicMenu />
      <Breadcrumb />
      
      <PlayersBattingStats
        key={`pbs-${leagueSeason.id}`}
      />
    </>
  )
}
export default PublicPlayersStats;