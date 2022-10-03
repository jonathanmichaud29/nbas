import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import { ILeague } from "../Interfaces/league";

import ChangePublicLeague from "../League/ChangePublicLeague";
import ToolStats from "../Tools/ToolStats";
import ToolCategoryCompare from "../Tools/ToolCategoryCompare";

import { getStoragePublicLeagueId, setStoragePublicLeagueId } from "../utils/localStorage";
import { setMetas } from "../utils/metaTags";

export default function PublicCompare(){
  
  setMetas({
    title:`Compare Stats`,
    description:`Compare statistics betweens teams or players`
  });

  /**
   * League Selection
   */
  const publicLeagueId = getStoragePublicLeagueId();
  const listLeagues = useSelector((state: RootState) => state.leagues )
  const [selectedLeague, setSelectedLeague] = useState<ILeague | null>(listLeagues.find((league) => league.id === publicLeagueId) || null);
  const changeSelectedLeague = (idLeague:number) => {
    setStoragePublicLeagueId(idLeague);
    const activeLeague = listLeagues.find((league) => league.id === idLeague) || null
    setSelectedLeague(activeLeague);
  }

  /**
   * Comparaison Types : Team or Player
   */
  const [selectedCategory, setSelectedCategory] = useState<string>("player");
  const changeSelectedCategory = (category:string) => {
    setSelectedCategory(category);
  }

  return (
    <>
      <ChangePublicLeague
        leagues={listLeagues}
        hideAllLeagueOption={true}
        defaultLeagueId={selectedLeague?.id || publicLeagueId}
        onLeagueChange={changeSelectedLeague}
      />
      <ToolCategoryCompare 
        category={selectedCategory}
        onCategoryChange={changeSelectedCategory}
      />
      { selectedLeague !== null && (
        <ToolStats
          league={selectedLeague}
          category={selectedCategory}
        />
      )}
    </>
  )
}
