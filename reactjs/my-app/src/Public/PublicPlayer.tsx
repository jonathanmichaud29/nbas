import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { IPlayer } from "../Interfaces/player";
import { ILeaguePlayer } from '../Interfaces/league';

import { fetchPlayers, IApiFetchPlayersParams } from '../ApiCall/players';
import { fetchPlayersLeagues, IApiFetchPlayersLeaguesParams } from '../ApiCall/leagues';

import ViewPlayerProfile from '../Players/ViewPlayerProfile';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';

function PublicPlayer() {
  let { id } = useParams();
  const idPlayer = id ? parseInt(id, 10) : null;

  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [playersLeagues, setPlayersLeagues] = useState<ILeaguePlayer[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = player !== null && playersLeagues !== null;

  if( isLoaded ){
    setMetas({
      title:`${player.name} Player profile`,
      description:`NBAS ${player.name} profile that included its standing, batting stats and each match summary played this season`
    });
  }
  
  /**
   * Fetch Player details
   */
  useEffect( () => {
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

  useEffect(() => {
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

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { player && playersLeagues && (
        <ViewPlayerProfile 
          player={player}
          playersLeagues={playersLeagues}
        />
      ) }
    </>
  )
}
export default PublicPlayer;