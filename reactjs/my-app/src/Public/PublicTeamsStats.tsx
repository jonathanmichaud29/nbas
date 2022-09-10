import { useState, useEffect, useCallback } from 'react';

import { ITeam } from '../Interfaces/team';
import { ILeague, ILeagueTeam } from '../Interfaces/league';

import { fetchLeagues, IApiFetchLeaguesParams } from '../ApiCall/leagues';
import { fetchLeagueTeams, fetchTeams, IApiFetchLeagueTeamsParams, IApiFetchTeamsParams } from '../ApiCall/teams';

import LoaderInfo from '../Generic/LoaderInfo';
import ChangePublicLeague from '../League/ChangePublicLeague';
import AllTeamsStanding from '../Teams/AllTeamsStanding';
import AllTeamsStats from '../Teams/AllTeamsStats';

import { setMetas } from '../utils/metaTags';
import { getStoragePublicLeagueId, setStoragePublicLeagueId } from '../utils/localStorage';
import { getLeagueName } from '../utils/dataAssociation';

function PublicTeamsStats() {
  const publicLeagueId = getStoragePublicLeagueId();
  const [listLeagues, setListLeagues] = useState<ILeague[] | null>(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(publicLeagueId !== 0 ? publicLeagueId : null);

  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listLeaguesTeams, setListLeaguesTeams] = useState<ILeagueTeam[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = listLeagues !== null && selectedLeagueId !== null && listTeams !== null && listLeaguesTeams !== null;

  const changeSelectedLeague = (idLeague:number) => {
    setStoragePublicLeagueId(idLeague);
    setSelectedLeagueId(idLeague);
  }

  /**
   * Fetch Leagues
   */
  if( listLeagues === null){
    const paramsFetchLeagues: IApiFetchLeaguesParams = {
      allLeagues:true
    }
    fetchLeagues(paramsFetchLeagues)
      .then(response => {
        setListLeagues(response.data);
        if( selectedLeagueId === null && response.data[0]){
          setSelectedLeagueId(response.data[0].id)
          setStoragePublicLeagueId(response.data[0].id);
        }
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }
  useEffect(()=>{
    if( listLeagues === null) return;
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      leagueIds: listLeagues.map((league) => league.id)
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        setListLeaguesTeams(response.data);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[listLeagues])

  useEffect(() =>{
    if( selectedLeagueId === null || listLeagues === null) return;
    const leagueName = getLeagueName(selectedLeagueId, listLeagues);
    setMetas({
      title:`${leagueName} Teams standing`,
      description:`${leagueName} teams standing this season with team batting statistics`
    });
  },[listLeagues, selectedLeagueId])

  /**
   * Fetch Teams
   */
  useEffect( () => {
    if ( listTeams !== null || listLeagues === null ) return;
    const paramsFetchTeams: IApiFetchTeamsParams = {
      allTeams: true,
      leagueIds: listLeagues.map((league) => league.id)
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        setListTeams(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [listLeagues, listTeams]);
  
  const getTeamsInLeague = useCallback((): ITeam[] => {
    const leagueTeams = listLeaguesTeams?.filter((leagueTeam) => leagueTeam.idLeague === selectedLeagueId);
    const teamsId = leagueTeams?.map((leagueTeam) => leagueTeam.idTeam)
    return (listTeams ? listTeams.filter((team) => teamsId?.includes(team.id) ) : [])
  }, [listLeaguesTeams, listTeams, selectedLeagueId]);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { isLoaded && (
        <ChangePublicLeague
          leagues={listLeagues}
          hideAllLeagueOption={true}
          defaultLeagueId={selectedLeagueId}
          onLeagueChange={changeSelectedLeague}
        />
      )}
      { isLoaded && (
        <AllTeamsStanding 
          teams={getTeamsInLeague()}
        />
      ) }
      { isLoaded && (
        <AllTeamsStats 
          teams={getTeamsInLeague()}
        />
      ) }
    </>
  )
}
export default PublicTeamsStats;