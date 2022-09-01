import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom'

import { IMatch } from "../Interfaces/match";

import { fetchMatches, IApiFetchMatchesParams } from '../ApiCall/matches';

import ViewMatchDetails from '../Matchs/ViewMatchDetails';
import LoaderInfo from '../Generic/LoaderInfo';



function PublicMatch() {
  let { id } = useParams();
  const idMatch = id ? parseInt(id, 10) : null;

  const [match, setMatch] = useState<IMatch | null>(null);
  const [apiError, changeApiError] = useState("");
  
  const isLoaded = match !== null;

  
  /**
   * Fetch Match details
   */
  useEffect( () => {
    if ( idMatch === null ) return;
    const paramsFetchMatches: IApiFetchMatchesParams = {
      matchIds: [idMatch]
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        setMatch(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [idMatch]);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { isLoaded && (
        <ViewMatchDetails 
          match={match}
        />
      ) }
    </>
  )
}
export default PublicMatch;