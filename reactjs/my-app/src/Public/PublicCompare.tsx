import { useMemo, useState } from "react";

import { usePublicContext } from "./PublicApp";

import Breadcrumb from "../Menu/Breadcrumb";
import PublicMenu from "../Menu/PublicMenu";
import ToolStats from "../Tools/ToolStats";
import ToolCategoryCompare, { ICompareCategory } from "../Tools/ToolCategoryCompare";

import { setMetas } from "../utils/metaTags";


export default function PublicCompare(){
  
  const { league, leagueSeason } = usePublicContext();

  useMemo(() => {
    setMetas({
      title:`${league.name} Compare Stats for season ${leagueSeason.name}`,
      description:`Compare ${league.name} statistics betweens teams or players for season ${leagueSeason.name}`
    });
  }, [league.name, leagueSeason.name])
  

  /**
   * Comparaison Types : Team or Player
   */
  const [selectedCategory, setSelectedCategory] = useState<ICompareCategory>("player");
  const changeSelectedCategory = (category:ICompareCategory) => {
    setSelectedCategory(category);
  }

  return (
    <>
      <PublicMenu />
      <Breadcrumb />
      
      <ToolCategoryCompare 
        category={selectedCategory}
        onCategoryChange={changeSelectedCategory}
      />
      
      <ToolStats
        key={`tool-stats-${leagueSeason.id}-${selectedCategory}`}
        category={selectedCategory}
      />
    </>
  )
}
