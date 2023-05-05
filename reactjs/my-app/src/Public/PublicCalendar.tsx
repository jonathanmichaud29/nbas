import { useState, useMemo, useEffect } from 'react';
import { batch } from 'react-redux';

import { usePublicContext } from './PublicApp';

import { ILeagueTeam } from '../Interfaces/league';
import { ITeam } from '../Interfaces/team';

import { IApiFetchLeagueTeamsParams, fetchLeagueTeams, IApiFetchTeamsParams, fetchTeams } from '../ApiCall/teams';

import LoaderInfo from '../Generic/LoaderInfo';
import SeasonMatches from '../Matchs/SeasonMatches';

import { setMetas } from '../utils/metaTags';

function PublicCalendar() {
  
  const { isAdmin, leagueSeason } = usePublicContext();

  const [apiError, changeApiError] = useState("");
  const [listTeams, setTeams] = useState<ITeam[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const dataTeamsEmpty = listTeams.length === 0;
  
  useEffect(() => {
    
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      leagueIds:[leagueSeason.idLeague]
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        const newLeagueTeams: ILeagueTeam[] = response.data || [];

        const teamIds = newLeagueTeams.map((leagueTeam) => leagueTeam.idTeam);

        const paramsFetchTeams: IApiFetchTeamsParams = {
          teamIds: teamIds
        }
        Promise.all([fetchTeams(paramsFetchTeams)])
          .catch((error) => {
            batch(() => {
              changeApiError(error);
              setDataLoaded(true);
            })
          })
          .then((values) =>{
            if( ! values ) return;
            batch(() => {
              setTeams(values[0].data);
              setDataLoaded(true)
            })
          })
          .finally(() => {
            
          });
      })
      .catch(error => {
        batch(()=>{
          changeApiError(error);
          setDataLoaded(true)
        })
        
      })
      .finally(() => {
        
      });
      
  }, [leagueSeason.idLeague]);

  useMemo(() =>{
    setMetas({
      title:`${leagueSeason.name} Calendar`,
      description:`${leagueSeason.name} teams standing this season with team batting statistics`
    });
  },[leagueSeason])

  return (
    <>
      <LoaderInfo
          isLoading={dataLoaded}
          msgError={apiError}
        />
      { ! dataTeamsEmpty ? (
        <SeasonMatches 
          leagueSeason={leagueSeason}
          listTeams={listTeams}
        />
      ) : '' };
    </>
  )
}
export default PublicCalendar;