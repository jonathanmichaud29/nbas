import { Tabs, Tab, Paper, AppBar } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ILeaguePlayer } from "../Interfaces/league";
import { RootState } from "../redux/store";
import { getLeagueName } from "../utils/dataAssociation";

interface IChangePublicLeague {
  playersLeagues:ILeaguePlayer[];
  onLeagueChange?(idLeague: number): void;
}
function ChangePublicLeague(props:IChangePublicLeague) {
  const { playersLeagues, onLeagueChange } = props;

  const [selectedLeague, setSelectedLeague] = useState<number>(0);

  const listLeagues = useSelector((state: RootState) => state.leagues )

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedLeague(newValue);
    onLeagueChange && onLeagueChange(newValue);
  }

  const tabSX = {
    fontSize:{xs:'0.8em', sm:'0.875em'},
    padding:{xs:'8px 12px', sm:'12px 16px'}
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
          <Tab key={`tab-league-0`} label="All" sx={tabSX}/>
          {playersLeagues.map((playerLeague:ILeaguePlayer) => (
            <Tab key={`tab-league-${playerLeague.idLeague}`} label={getLeagueName(playerLeague.idLeague, listLeagues)} sx={tabSX}/>
          ))}
        </Tabs>
      </Paper>
    </AppBar>
    
  )
}

export default ChangePublicLeague;