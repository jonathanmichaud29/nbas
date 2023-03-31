import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import { Tabs, Tab, Paper, AppBar, Alert, FormControl, /* InputLabel, Select, MenuItem */ } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

/* import { SelectChangeEvent } from "@mui/material/Select" */
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
  const sLeagueId = defaultLeagueId as unknown as string || '0';

  const [selectedLeague, setSelectedLeague] = useState<string>(sLeagueId);

  const listLeagues = useSelector((state: RootState) => state.leagues )

  /* const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedLeague(newValue);
    onLeagueChange && onLeagueChange(newValue);
  } */

  const handleLeagueChange = (event: SelectChangeEvent) => {
    setSelectedLeague(event.target.value);
    onLeagueChange && onLeagueChange(event.target.value as unknown as number);
  }

  return (
    <AppBar position="sticky" color="transparent">
      <Paper color="primary">
        <FormControl size="small">
          <Select
            labelId="label-switch-public-league"
            id="switch-public-league"
            value={selectedLeague as string}
            onChange={handleLeagueChange}
          >
            {leagues && leagues.map((league:ILeague) => (
              <MenuItem value={league.id}>{league.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <Tabs 
          value={selectedLeague} 
          onChange={handleChange} 
          aria-label="Filter results by league" 
          variant="scrollable"
          allowScrollButtonsMobile={true}
          orientation='horizontal'
        >
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
        </Tabs> */}
        { hideAllLeagueOption && defaultLeagueId === 0 && (
          <Alert severity="info">A league is required to display information</Alert>
        )}
      </Paper>
    </AppBar>
    
  )
}

export default ChangePublicLeague;