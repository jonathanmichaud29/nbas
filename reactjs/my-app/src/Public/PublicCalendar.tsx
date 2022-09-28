import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

import { ILeague } from '../Interfaces/league';

import ChangePublicLeague from '../League/ChangePublicLeague';
import ListMatches from '../Matchs/ListMatches';

import { getStoragePublicLeagueId, setStoragePublicLeagueId } from '../utils/localStorage';
import { setMetas } from '../utils/metaTags';

function PublicCalendar() {
  const publicLeagueId = getStoragePublicLeagueId();
  const listLeagues = useSelector((state: RootState) => state.leagues )
  const [selectedLeague, setSelectedLeague] = useState<ILeague | null>(listLeagues.find((league) => league.id === publicLeagueId) || null);
  const changeSelectedLeague = (idLeague:number) => {
    setStoragePublicLeagueId(idLeague);
    const activeLeague = listLeagues.find((league) => league.id === idLeague) || null
    setSelectedLeague(activeLeague);
  }

  useMemo(() =>{
    setMetas({
      title:`${selectedLeague?.name} Calendar`,
      description:`${selectedLeague?.name} teams standing this season with team batting statistics`
    });
  },[selectedLeague])

  return (
    <>
      <ChangePublicLeague
        leagues={listLeagues}
        hideAllLeagueOption={true}
        defaultLeagueId={selectedLeague?.id || publicLeagueId}
        onLeagueChange={changeSelectedLeague}
      />
      {selectedLeague !== null && (
        <ListMatches 
          league={selectedLeague}
          isAdmin={false}
        />
      )}
    </>
  )
}
export default PublicCalendar;