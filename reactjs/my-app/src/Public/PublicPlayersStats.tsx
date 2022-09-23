import { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

import { ILeague } from '../Interfaces/league';

import ChangePublicLeague from '../League/ChangePublicLeague';
import PlayersBattingStats from '../Players/PlayersBattingStats';

import { getStoragePublicLeagueId, setStoragePublicLeagueId } from '../utils/localStorage';

function PublicPlayersStats() {
  const publicLeagueId = getStoragePublicLeagueId();
  const listLeagues = useSelector((state: RootState) => state.leagues )
  
  const [selectedLeague, setSelectedLeague] = useState<ILeague | null>(listLeagues.find((league) => league.id === publicLeagueId) || null);
  const changeSelectedLeague = (idLeague:number) => {
    setStoragePublicLeagueId(idLeague);
    const activeLeague = listLeagues.find((league) => league.id === idLeague) || null
    setSelectedLeague(activeLeague);
  }

  return (
    <>
      <ChangePublicLeague
        hideAllLeagueOption={true}
        leagues={listLeagues}
        defaultLeagueId={selectedLeague?.id || publicLeagueId}
        onLeagueChange={changeSelectedLeague}
      />
      { selectedLeague !== null && (
        <PlayersBattingStats
          key={`pbs-${selectedLeague.id}`}
          league={selectedLeague}
        />
      )}
    </>
  )
}
export default PublicPlayersStats;