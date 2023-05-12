import { useState, useEffect } from 'react';
import { batch } from 'react-redux';

import { usePublicContext } from './PublicApp';

import { ITeam, ITeamSeason } from '../Interfaces/team';
import { ILeagueTeam } from '../Interfaces/league';

import { fetchLeagueTeams, fetchTeams, fetchTeamSeasons, IApiFetchLeagueTeamsParams, IApiFetchTeamSeasonsParams, IApiFetchTeamsParams } from '../ApiCall/teams';

import LoaderInfo from '../Generic/LoaderInfo';
import AllTeamsStanding from '../Teams/AllTeamsStanding';
import AllTeamsStats from '../Teams/AllTeamsStats';

import { setMetas } from '../utils/metaTags';
import { filterTeamsBySeason } from '../utils/dataFilter';

function PublicTeamsStats() {

  const { leagueSeason } = usePublicContext();
  
  const [listTeams, setListTeams] = useState<ITeam[]>([]);
  const [listLeaguesTeams, setListLeaguesTeams] = useState<ILeagueTeam[]>([]);
  const [listSeasonsTeams, setListSeasonsTeams] = useState<ITeamSeason[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [apiError, changeApiError] = useState("");

  const filteredTeams = filterTeamsBySeason(listTeams, listLeaguesTeams, listSeasonsTeams, leagueSeason);
  filteredTeams.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(()=>{
    let newLeagueTeams: ILeagueTeam[] = [];
    let newTeams: ITeam[] = [];
    let newSeasonsTeams: ITeamSeason[] = [];
    /**
     * Fetch all league teams
     */
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      leagueIds: [leagueSeason.idLeague] // listLeagues.map((league) => league.id)
    }
    const paramsFetchTeams: IApiFetchTeamsParams = {
      allTeams: true,
      leagueIds: [leagueSeason.idLeague]// listLeagues.map((league) => league.id)
    }

    Promise.all([fetchLeagueTeams(paramsFetchLeagueTeams), fetchTeams(paramsFetchTeams)])
      .catch((error) => {
        batch(() => {
          changeApiError(error);
          setDataLoaded(true);
        })
      })
      .then((values) =>{
        if( ! values ) return;
        
        newLeagueTeams = values[0].data || [];
        newTeams = values[1].data || [];

        const paramsFetchTeamSeasons: IApiFetchTeamSeasonsParams = {
          teamIds: newTeams.map((team)=>team.id)
        }
        fetchTeamSeasons(paramsFetchTeamSeasons)
          .then((response) => {
            newSeasonsTeams = response.data;
          })
          .catch((error) => {
            batch(() => {
              changeApiError(error)
              setDataLoaded(true);
            })
          })
          .finally(() => {
            batch(()=>{
              setListLeaguesTeams(newLeagueTeams);
              setListTeams(newTeams)
              setListSeasonsTeams(newSeasonsTeams);
              setDataLoaded(true);
            })
          })
        
      })
      .finally(()=>{
        
      })
  },[leagueSeason.idLeague])

  useEffect(() =>{
    setMetas({
      title:`${leagueSeason.name} Teams standing`,
      description:`${leagueSeason.name} teams standing this season with team batting statistics`
    });
  },[leagueSeason])

  

  return (
    <>
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      
      { listTeams.length > 0 && (
        <AllTeamsStanding 
          key={`teams-standing-${leagueSeason.id}`}
          teams={filteredTeams}
        />
      ) }
      { listTeams.length > 0 && (
        <AllTeamsStats 
          key={`teams-stats-${leagueSeason.id}`}
          teams={filteredTeams}
          leagueSeason={leagueSeason}
        />
      ) }
    </>
  )
}
export default PublicTeamsStats;