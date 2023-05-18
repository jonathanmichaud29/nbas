import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { usePublicContext } from './PublicApp';

import Breadcrumb from '../Menu/Breadcrumb';
import PublicMenu from '../Menu/PublicMenu';
import ViewTeamProfile from '../Teams/ViewTeamProfile';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';
import { castNumber } from '../utils/castValues';



function PublicTeam() {
  const { id } = useParams();
  const idTeam = castNumber(id);

  const { league, leagueSeason, leagueSeasonTeams } = usePublicContext();

  const [apiError, changeApiError] = useState("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  
  const team = leagueSeasonTeams.find((team) => team.id === idTeam) || null;

  useEffect(() => {
    if( team === null){
      changeApiError("This player does not exists in this league")
    } else {
      setMetas({
        title:`${team.name} profile - ${league.name} ${leagueSeason.name}`,
        description:`${league.name} ${team.name} team profile that included its standing, batting stats and each match summary played the season ${leagueSeason.name}`
      });
      setDataLoaded(true);
    }
  }, [league.name, leagueSeason.name, team])
    
  return (
    <>
      <PublicMenu />
      <Breadcrumb />
      
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { team ? (
        <ViewTeamProfile 
          team={team}
        />
      ) : '' }
    </>
  )
}
export default PublicTeam;