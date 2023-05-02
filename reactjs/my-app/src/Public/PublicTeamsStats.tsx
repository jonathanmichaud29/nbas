import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

import { ITeam } from '../Interfaces/team';
import { ILeague, ILeagueTeam } from '../Interfaces/league';

import { fetchLeagueTeams, fetchTeams, IApiFetchLeagueTeamsParams, IApiFetchTeamsParams } from '../ApiCall/teams';

import LoaderInfo from '../Generic/LoaderInfo';
import ChangePublicLeague from '../League/ChangePublicLeague';
import AllTeamsStanding from '../Teams/AllTeamsStanding';
import AllTeamsStats from '../Teams/AllTeamsStats';

import { setMetas } from '../utils/metaTags';
import { getStoragePublicLeagueId, setStoragePublicLeagueId } from '../utils/localStorage';

function PublicTeamsStats() {
  const publicLeagueId = getStoragePublicLeagueId();
  const listLeagues = useSelector((state: RootState) => state.leagues )
  const [selectedLeague, setSelectedLeague] = useState<ILeague | null>(listLeagues.find((league) => league.id === publicLeagueId) || null);

  const changeSelectedLeague = (idLeague:number) => {
    setStoragePublicLeagueId(idLeague);
    const activeLeague = listLeagues.find((league) => league.id === idLeague) || null
    setSelectedLeague(activeLeague);
  }

  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [listLeaguesTeams, setListLeaguesTeams] = useState<ILeagueTeam[] | null>(null);
  const [apiError, changeApiError] = useState("");


  useMemo(()=>{
    /**
     * Fetch all team-league association
     */
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
    
    /**
     * Fetch all teams details
     */
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
  },[listLeagues])

  useMemo(() =>{
    setMetas({
      title:`${selectedLeague?.name} Teams standing`,
      description:`${selectedLeague?.name} teams standing this season with team batting statistics`
    });
  },[selectedLeague])

  
  const leagueTeamsIds = listLeaguesTeams?.filter((leagueTeam) => leagueTeam.idLeague === selectedLeague?.id).map((leagueTeam) => leagueTeam.idTeam);
  const listLeagueTeams = (listTeams ? listTeams.filter((team) => leagueTeamsIds?.includes(team.id) ) : []);

  const isLoaded = listLeagueTeams !== null && listTeams !== null;

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      {/* <ChangePublicLeague
        leagues={listLeagues}
        hideAllLeagueOption={true}
        defaultLeagueId={selectedLeague?.id || publicLeagueId}
        onLeagueChange={changeSelectedLeague}
      /> */}
      
      { listLeagueTeams.length > 0 && (
        <AllTeamsStanding 
          key={`teams-standing-${selectedLeague?.id}`}
          teams={listLeagueTeams}
        />
      ) }
      { listLeagueTeams.length > 0 && (
        <AllTeamsStats 
          key={`teams-stats-${selectedLeague?.id}`}
          teams={listLeagueTeams}
        />
      ) }
    </>
  )
}
export default PublicTeamsStats;