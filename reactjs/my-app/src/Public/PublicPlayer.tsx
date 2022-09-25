import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

import { IPlayer } from "../Interfaces/player";
import { ILeague, ILeaguePlayer } from '../Interfaces/league';

import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchPlayersLeagues, IApiFetchPlayersLeaguesParams } from '../ApiCall/leagues';

import ViewPlayerProfile from '../Players/ViewPlayerProfile';
import LoaderInfo from '../Generic/LoaderInfo';
import ChangePublicLeague from '../League/ChangePublicLeague';

import { setMetas } from '../utils/metaTags';
import { getStoragePublicLeagueId, setStoragePublicLeagueId } from '../utils/localStorage';
import { castNumber } from '../utils/castValues';

function PublicPlayer() {
  let { id } = useParams();
  const idPlayer = castNumber(id);

  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [playersLeagues, setPlayersLeagues] = useState<ILeaguePlayer[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const publicLeagueId = getStoragePublicLeagueId();
  const listLeagues = useSelector((state: RootState) => state.leagues )
  const [selectedLeague, setSelectedLeague] = useState<ILeague | null>(listLeagues.find((league) => league.id === publicLeagueId) || null);
  const changeSelectedLeague = (idLeague:number) => {
    setStoragePublicLeagueId(idLeague);
    const activeLeague = listLeagues.find((league) => league.id === idLeague) || null
    setSelectedLeague(activeLeague);
  }

  const isLoaded = player !== null && playersLeagues !== null;

  if( isLoaded ){
    setMetas({
      title:`${player.name} Player profile`,
      description:`${selectedLeague?.name} ${player.name} profile that included its standing, batting stats and each match summary played this season`
    });
  }
  
  /**
   * Fetch Player details
   */
  useMemo( () => {
    if ( idPlayer === null ) return;
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      playerIds: [idPlayer],
      allLeagues: true
    }
    fetchPlayers(paramsFetchPlayers)
      .then(response => {
        setPlayer(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [idPlayer]);

  useMemo(() => {
    if ( idPlayer === null ) return;
    const paramsFetchPlayersLeagues: IApiFetchPlayersLeaguesParams = {
      playerIds:[idPlayer]
    }
    fetchPlayersLeagues(paramsFetchPlayersLeagues)
      .then(response => {
        setPlayersLeagues(response.data);
      })
      .catch(error => {
        /* changeApiError(error); */
      })
      .finally(() => {
        /* setIsLeaguePlayersLoaded(true); */
      });
  }, [idPlayer])

  const filterLeaguesByPlayerLeagues = () => {
    const responseLeagueIds = playersLeagues?.map((league) => league.idLeague) || [];
    return listLeagues.filter((league) => {
      return responseLeagueIds.includes(league.id) 
    })
  }

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      <ChangePublicLeague
        leagues={filterLeaguesByPlayerLeagues()}
        defaultLeagueId={selectedLeague?.id || publicLeagueId}
        onLeagueChange={changeSelectedLeague}
      />
      { player && playersLeagues && (
        <ViewPlayerProfile 
          player={player}
          playersLeagues={playersLeagues}
          league={selectedLeague}
        />
      ) }
    </>
  )
}
export default PublicPlayer;