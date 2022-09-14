import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { ITeam } from "../Interfaces/team";

import { fetchLeagueTeams, fetchTeams, IApiFetchLeagueTeamsParams, IApiFetchTeamsParams } from '../ApiCall/teams';

import ViewTeamProfile from '../Teams/ViewTeamProfile';
import LoaderInfo from '../Generic/LoaderInfo';

import { setMetas } from '../utils/metaTags';
import { ILeague } from '../Interfaces/league';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { filterLeague } from '../utils/dataFilter';

function PublicTeam() {
  let { id } = useParams();
  const idTeam = id ? parseInt(id, 10) : null;

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
   * Fetch Match details
   */
  useEffect( () => {
    if ( idTeam === null ) return;

    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [idTeam]
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
  }, [idTeam]);

  useEffect(() => {
    if( team === null) return;
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      teamIds: [team.id]
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
  }, [listLeagues, team])

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