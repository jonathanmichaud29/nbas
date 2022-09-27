import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

import { ITeam } from "../Interfaces/team";
import { ILeague } from '../Interfaces/league';

import { fetchLeagueTeams, fetchTeams, IApiFetchLeagueTeamsParams, IApiFetchTeamsParams } from '../ApiCall/teams';

import ViewTeamProfile from '../Teams/ViewTeamProfile';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';
import { filterLeague } from '../utils/dataFilter';
import { castNumber } from '../utils/castValues';

function PublicTeam() {
  const { id } = useParams();
  const idTeam = castNumber(id);

  const [team, setTeam] = useState<ITeam | null>(null);
  const [league, setLeague] = useState<ILeague | null>(null);
  const [apiError, changeApiError] = useState("");

  const listLeagues = useSelector((state: RootState) => state.leagues )

  const isLoaded = team !== null && league !== null;
  
  if( isLoaded ){
    setMetas({
      title:`${team.name} Team profile - ${league.name}`,
      description:`${league.name} ${team.name} team profile that included its standing, batting stats and each match summary played the current season`
    });
  }
  
  /**
   * Fetch Team League
   */

   useMemo(() => {
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      teamIds: [idTeam]
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        setLeague(filterLeague(response.data[0].idLeague, listLeagues))
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [idTeam, listLeagues])

  /**
   * Fetch Team
   */  
  useMemo(() => {
    if( league === null) return;
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [idTeam],
      leagueIds: [league.id]
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
  },[idTeam, league])

  

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
          league={league}
        />
      ) }
    </>
  )
}
export default PublicTeam;