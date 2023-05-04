
import PlayersBattingStats from '../Players/PlayersBattingStats';

import { usePublicContext } from './PublicApp';

function PublicPlayersStats() {
  const { isAdmin, leagueSeason } = usePublicContext();

  return (
    <>
      <PlayersBattingStats
        key={`pbs-${leagueSeason.id}`}
        leagueSeason={leagueSeason}
      />
    </>
  )
}
export default PublicPlayersStats;