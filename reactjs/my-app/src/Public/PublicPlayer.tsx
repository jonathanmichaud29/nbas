import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { usePublicContext } from './PublicApp';

import PublicMenu from '../Menu/PublicMenu';
import Breadcrumb from '../Menu/Breadcrumb';
import ViewPlayerProfile from '../Players/ViewPlayerProfile';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';
import { castNumber } from '../utils/castValues';

function PublicPlayer() {
  let { id } = useParams();
  const idPlayer = castNumber(id);

  const { league, leagueSeason, leaguePlayers } = usePublicContext();

  const [apiError, changeApiError] = useState<string>("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const player = leaguePlayers.find((player) => player.id === idPlayer) || null;

  useEffect(() => {
    if( player === null){
      changeApiError("This player does not exists in this league")
    } else {
      setMetas({
        title:`${player.name} profile - ${league.name} ${leagueSeason.name}`,
        description:`${player.name} profile that included its standing, batting stats and each match summary played during this season`
      });
      setDataLoaded(true);
    }
  }, [league.name, leagueSeason.name, player])

  

  return (
    <>
      <PublicMenu />
      <Breadcrumb />

      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { player ? (
        <ViewPlayerProfile 
          player={player}
        />
      ) : '' }
    </>
  )
}
export default PublicPlayer;