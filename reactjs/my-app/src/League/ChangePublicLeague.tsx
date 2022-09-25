import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import { Tabs, Tab, Paper, AppBar } from "@mui/material";

import { ILeague, ILeaguePlayer } from "../Interfaces/league";

import { getLeagueName } from "../utils/dataAssociation";
import { sxGroupStyles } from "../utils/theme";

interface IChangePublicLeague {
  leagues?:ILeague[];
  defaultLeagueId?:number;
  hideAllLeagueOption?:boolean;
  playersLeagues?:ILeaguePlayer[];
  onLeagueChange?(idLeague: number): void;
}
function ChangePublicLeague(props:IChangePublicLeague) {
  const { leagues, defaultLeagueId, hideAllLeagueOption, playersLeagues, onLeagueChange } = props;

  const [selectedLeague, setSelectedLeague] = useState<number>(defaultLeagueId || 0);

  const listLeagues = useSelector((state: RootState) => state.leagues )

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedLeague(newValue);
    onLeagueChange && onLeagueChange(newValue);
  }

  return (
    <AppBar position="sticky" color="transparent">
      <Paper color="primary">
        <Tabs 
          value={selectedLeague} 
          onChange={handleChange} 
          aria-label="Filter results by league" 
          variant="scrollable"
          allowScrollButtonsMobile={true}
          orientation='horizontal'
        >
          {/* {!hideAllLeagueOption && <Tab key={`tab-league-0`} label="All" value={0} sx={sxGroupStyles.tabSwitchLeague}/>} */}
          <Tab key={`tab-league-0`} label="All" value={0} disabled={hideAllLeagueOption} sx={sxGroupStyles.tabSwitchLeague}/>
          {playersLeagues && playersLeagues.map((playerLeague:ILeaguePlayer) => (
            <Tab 
              key={`tab-league-${playerLeague.idLeague}`} 
              label={getLeagueName(playerLeague.idLeague, listLeagues)} 
              value={playerLeague.idLeague} 
              sx={sxGroupStyles.tabSwitchLeague}
            />
          ))}
          {leagues && leagues.map((league:ILeague) => (
            <Tab 
              key={`tab-league-${league.id}`} 
              label={league.name} 
              value={league.id} 
              sx={sxGroupStyles.tabSwitchLeague}
            />
          ))}
        </Tabs>
      </Paper>
    </AppBar>
    
  )
}

export default ChangePublicLeague;