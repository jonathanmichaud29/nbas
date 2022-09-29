import { useState, useMemo } from 'react';
import { useParams} from 'react-router-dom'

import { IMatch } from "../Interfaces/match";

import { fetchMatches, IApiFetchMatchesParams } from '../ApiCall/matches';

import ViewMatchDetails from '../Matchs/ViewMatchDetails';
import LoaderInfo from '../Generic/LoaderInfo';

import { castNumber } from '../utils/castValues';


function PublicMatch() {
  let { id } = useParams();
  const idMatch = castNumber(id);

  const [match, setMatch] = useState<IMatch | null>(null);
  const [apiError, changeApiError] = useState("");
  
  const isLoaded = match !== null;

  
  /**
   * Fetch Match details
   */
  useMemo( () => {
    const paramsFetchMatches: IApiFetchMatchesParams = {
      matchIds: [idMatch],
      isIgnoringLeague: true,
    }
    fetchMatches(paramsFetchMatches)
      .then(response => {
        if( response.data[0] === undefined ){
          changeApiError("Something went wrong. Please contact the administrator")
        }
        else{
          setMatch(response.data[0])
        }
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
      { match !== null && (
        <ViewMatchDetails 
          match={match}
        />
      ) }
    </>
  )
}
export default PublicMatch;