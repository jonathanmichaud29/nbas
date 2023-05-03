import { useEffect, useState } from "react";

import { ITeam } from "../Interfaces/team";

import { usePublicContext } from "./PublicApp";

import { IApiFetchTeamsParams, fetchTeams } from "../ApiCall/teams";

import ChangePublicLeague from "../League/ChangePublicLeague";
import ClosestMatches from "../Matchs/ClosestMatches";
import BestLeaguePlayers from "../Players/BestLeaguePlayers";
import AllTeamsStanding from "../Teams/AllTeamsStanding";


import LoaderInfo from "../Generic/LoaderInfo";

function HomeLeague() {
  const { isAdmin, leagueSeason } = usePublicContext();

  const [listTeams, setListTeams] = useState<ITeam[] | null>(null);
  const [apiError, changeApiError] = useState('');

  const isLoaded = listTeams !== null && leagueSeason.id ? true : false;

  useEffect(()=>{
    /**
     * Fetch all teams details
     */
    const paramsFetchTeams: IApiFetchTeamsParams = {
      allTeams: true,
      leagueSeasonIds: [leagueSeason.id]
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        setListTeams(response.data)
      })
      .catch(error => {
        changeApiError(error);
        setListTeams([]);
      })
      .finally(() => {
        
      });
  },[leagueSeason.id])

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
      />
      
      { ( isLoaded && listTeams ) ? (
        <AllTeamsStanding 
          key={`teams-standing-${leagueSeason.id}`}
          teams={listTeams}
        />
      ) : '' }

      {/* { isLoaded ? (
        <ClosestMatches
          key={`cm-${leagueSeason.id}`}
          league={leagueSeason}
        />
      ) : ''} */}
      { isLoaded ? (
        <BestLeaguePlayers
          key={`blp-${leagueSeason.id}`}
          leagueSeason={leagueSeason}
        />
      ) : ''}
    </>
  )
}
export default HomeLeague;