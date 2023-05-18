import { useState, useEffect } from 'react';
import { batch } from 'react-redux';

import { usePublicContext } from './PublicApp';

import LoaderInfo from '../Generic/LoaderInfo';
import Breadcrumb from '../Menu/Breadcrumb';
import PublicMenu from '../Menu/PublicMenu';
import AllTeamsStanding from '../Teams/AllTeamsStanding';
import AllTeamsStats from '../Teams/AllTeamsStats';

import { setMetas } from '../utils/metaTags';


function PublicTeamsStats() {

  const { league, leagueSeason, leagueSeasonTeams } = usePublicContext();
  
  const [apiError, changeApiError] = useState<string>("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  leagueSeasonTeams.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() =>{
    let newError: string = '';
    if( leagueSeasonTeams.length === 0 ){
      newError = "There is no teams for this season";
    }
    batch(() => {
      changeApiError(newError);
      setDataLoaded(true);
      setMetas({
        title:`${league.name} Teams standing - ${leagueSeason.name}`,
        description:`${leagueSeason.name} teams standing this season with each team batting statistics`
      });
    })
  },[league.name, leagueSeason, leagueSeasonTeams.length])

  

  return (
    <>
      <PublicMenu />
      <Breadcrumb />
      
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      { leagueSeasonTeams.length > 0 
      ? 
        <>
          <AllTeamsStanding 
            key={`teams-standing-${leagueSeason.id}`}
            teams={leagueSeasonTeams}
          />
          <AllTeamsStats 
            key={`teams-stats-${leagueSeason.id}`}
            teams={leagueSeasonTeams}
            leagueSeason={leagueSeason}
          />
        </>
      : ''}
    </>
  )
}
export default PublicTeamsStats;