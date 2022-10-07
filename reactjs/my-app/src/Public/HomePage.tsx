import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import { ILeague } from "../Interfaces/league";
import { ITeam } from "../Interfaces/team";

import { IApiFetchTeamsParams, fetchTeams } from "../ApiCall/teams";

import ChangePublicLeague from "../League/ChangePublicLeague";
import ClosestMatches from "../Matchs/ClosestMatches";
import BestLeaguePlayers from "../Players/BestLeaguePlayers";
import AllTeamsStanding from "../Teams/AllTeamsStanding";

import { getStoragePublicLeagueId, setStoragePublicLeagueId } from "../utils/localStorage";

function HomePage() {
  const publicLeagueId = getStoragePublicLeagueId();
  const listLeagues = useSelector((state: RootState) => state.leagues )
  
  const [selectedLeague, setSelectedLeague] = useState<ILeague | null>(listLeagues.find((league) => league.id === publicLeagueId) || null);
  const changeSelectedLeague = (idLeague:number) => {
    setStoragePublicLeagueId(idLeague);
    const activeLeague = listLeagues.find((league) => league.id === idLeague) || null
    setSelectedLeague(activeLeague);
  }

  const [listTeams, setListTeams] = useState<ITeam[]>([]);

  useMemo(()=>{
    if( selectedLeague === null ) return;
    
    /**
     * Fetch all teams details
     */
    const paramsFetchTeams: IApiFetchTeamsParams = {
      allTeams: true,
      leagueIds: [selectedLeague.id]
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        setListTeams(response.data)
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  },[selectedLeague])

  return (
    <>
      <ChangePublicLeague
        hideAllLeagueOption={true}
        leagues={listLeagues}
        defaultLeagueId={selectedLeague?.id || publicLeagueId}
        onLeagueChange={changeSelectedLeague}
      />
      { selectedLeague !== null && listTeams.length > 0 && (
        <AllTeamsStanding 
          key={`teams-standing-${selectedLeague?.id}`}
          teams={listTeams}
        />
      ) }
      { selectedLeague !== null && (
        <ClosestMatches
          key={`cm-${selectedLeague.id}`}
          league={selectedLeague}
        />
      )}
      { selectedLeague !== null && (
        <BestLeaguePlayers
          key={`blp-${selectedLeague.id}`}
          league={selectedLeague}
        />
      )}
    </>
  )
}
export default HomePage;