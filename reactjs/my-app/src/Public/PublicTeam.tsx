import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { usePublicContext } from './PublicApp';

import { ITeam } from "../Interfaces/team";

import { fetchTeams, IApiFetchTeamsParams } from '../ApiCall/teams';

import ViewTeamProfile from '../Teams/ViewTeamProfile';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';
import { castNumber } from '../utils/castValues';


function PublicTeam() {
  const { id } = useParams();
  const idTeam = castNumber(id);

  const { leagueSeason } = usePublicContext();

  const [team, setTeam] = useState<ITeam | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = team !== null;
  
  useMemo(() => {
    if( team === null) return;
    setMetas({
      title:`${team.name} Team profile - ${leagueSeason.name}`,
      description:`${leagueSeason.name} ${team.name} team profile that included its standing, batting stats and each match summary played the current season`
    });
  },[team, leagueSeason])
    
  /**
   * Fetch Team
   */  
  useEffect(() => {
    
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [idTeam],
      leagueIds: [leagueSeason.idLeague]
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        setTeam(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[idTeam, leagueSeason])

  

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { isLoaded && (
        <ViewTeamProfile 
          team={team}
          leagueSeason={leagueSeason}
        />
      ) }
    </>
  )
}
export default PublicTeam;