import { useMemo } from "react";

import { usePublicContext } from "./PublicApp";

import ClosestMatches from "../Matchs/ClosestMatches";
import BestLeaguePlayers from "../Players/BestLeaguePlayers";
import AllTeamsStanding from "../Teams/AllTeamsStanding";
import Breadcrumb from "../Menu/Breadcrumb";
import PublicMenu from "../Menu/PublicMenu";

import { setMetas } from "../utils/metaTags";


function HomeLeague() {

  const { league, leagueSeason, leagueSeasonTeams } = usePublicContext();

  useMemo(() =>{
    setMetas({
      title:`Calendar - ${league.name} ${leagueSeason.name}`,
      description:`${league.name} summary for the season ${leagueSeason.name}`
    });
  },[league.name, leagueSeason.name])

  return (
    <>
      <PublicMenu />
      <Breadcrumb />
      
      <AllTeamsStanding 
        key={`teams-standing-${leagueSeason.id}`}
        teams={leagueSeasonTeams}
      />

      <ClosestMatches
        key={`cm-${leagueSeason.id}`}
        leagueSeason={leagueSeason}
      />

      <BestLeaguePlayers
        key={`blp-${leagueSeason.id}`}
        leagueSeason={leagueSeason}
      />
    </>
  )
}
export default HomeLeague;