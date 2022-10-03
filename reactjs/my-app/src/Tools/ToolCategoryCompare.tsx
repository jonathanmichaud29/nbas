import { useState } from "react";

import { AppBar, Box, Paper, Tab, Tabs } from "@mui/material";

import { sxGroupStyles } from "../utils/theme";

interface IToolCategoryCompareProps{
  category:string;
  onCategoryChange?(category: string): void;
}

export default function ToolCategoryCompare(props: IToolCategoryCompareProps){

  const [selectedCategory, setSelectedCategory] = useState<string>(props.category)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
    props.onCategoryChange && props.onCategoryChange(newValue);
  }

  return (
    <AppBar position="sticky" color="secondary">
      <Paper component={Box} color="primary" elevation={0} square={true}>
        <Tabs 
          value={selectedCategory} 
          onChange={handleChange} 
          aria-label="Compare stats" 
          variant="scrollable"
          allowScrollButtonsMobile={true}
          orientation='horizontal'
        >
          <Tab key={`tab-category-teams`} label="Teams" value={`team`} sx={sxGroupStyles.tabSwitchLeague}/>
          <Tab key={`tab-category-players`} label="Players" value={`player`} sx={sxGroupStyles.tabSwitchLeague}/>
        </Tabs>

      </Paper>
    </AppBar>
    
  )
}
