import { useState } from "react";

import { usePublicContext } from "./PublicApp";

import ToolStats from "../Tools/ToolStats";
import ToolCategoryCompare, { ICompareCategory } from "../Tools/ToolCategoryCompare";

import { setMetas } from "../utils/metaTags";


export default function PublicCompare(){
  
  const { isAdmin, leagueSeason } = usePublicContext();

  setMetas({
    title:`Compare Stats`,
    description:`Compare statistics betweens teams or players`
  });

  /**
   * Comparaison Types : Team or Player
   */
  const [selectedCategory, setSelectedCategory] = useState<ICompareCategory>("player");
  const changeSelectedCategory = (category:ICompareCategory) => {
    setSelectedCategory(category);
  }

  return (
    <>
      <ToolCategoryCompare 
        category={selectedCategory}
        onCategoryChange={changeSelectedCategory}
      />
      
      <ToolStats
        key={`tool-stats-${leagueSeason.id}-${selectedCategory}`}
        leagueSeason={leagueSeason}
        category={selectedCategory}
      />
    </>
  )
}
