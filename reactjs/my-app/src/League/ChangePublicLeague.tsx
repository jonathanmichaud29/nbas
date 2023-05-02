import { useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";

import { Paper, AppBar, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { AppDispatch, RootState } from "../redux/store";
import { setPublicLeague, setPublicLeagueSeason } from "../redux/publicContextSlice";
import { resetLeaguePlayers } from "../redux/leaguePlayerSlice";
import { resetLeagueTeams } from "../redux/leagueTeamSlice";
import { resetPlayers } from "../redux/playerSlice";
import { resetTeams } from "../redux/teamSlice";

import { ILeague, ILeagueSeason } from "../Interfaces/league";

import LoaderInfo from "../Generic/LoaderInfo";

import { getStoragePublicLeagueId, getStoragePublicLeagueSeasonId, 
  setStoragePublicLeagueId, setStoragePublicLeagueSeasonId } from "../utils/localStorage";
import { castNumber } from "../utils/castValues";


interface IChangePublicLeague {
  
}
function ChangePublicLeague(props:IChangePublicLeague) {
  const dispatch = useDispatch<AppDispatch>();

  const currentLeagueId = getStoragePublicLeagueId();
  const currentLeagueSeasonId = getStoragePublicLeagueSeasonId();
  const statePublicContext = useSelector((state: RootState) => state.publicContext )
  
  const [apiError, changeApiError] = useState('');

  const handleLeagueChange = (event: SelectChangeEvent) => {
    const newLeagueId = castNumber(event.target.value);
    const newLeague = statePublicContext.leagues.find((league: ILeague) => league.id === newLeagueId) || null;
    
    // Find latest season for the choosen league
    let newLeagueSeason: ILeagueSeason | null = null;
    const leagueSeasons = statePublicContext.leagueSeasons.filter((leagueSeason: ILeagueSeason) => leagueSeason.idLeague === newLeagueId);
    if( leagueSeasons && leagueSeasons.length ){
      newLeagueSeason = leagueSeasons.sort((a,b) => b.id - a.id)[0];
    }

    // Dispatch new current League & Season
    
    setStoragePublicLeagueId(newLeagueId);
    setStoragePublicLeagueSeasonId(newLeagueSeason?.id || 0);

    batch(() => {
      dispatch(setPublicLeague(newLeague));
      dispatch(setPublicLeagueSeason(newLeagueSeason));
      dispatch(resetPlayers());
      dispatch(resetLeaguePlayers());
      dispatch(resetTeams());
      dispatch(resetLeagueTeams()); 
    })
    
    // dispatch(resetLeagueSeasons());
  }

  const handleLeagueSeasonChange = (event: SelectChangeEvent) => {
    const newLeagueSeasonId = event.target.value as unknown as number;
    const newLeagueSeason = statePublicContext.leagueSeasons.find((leagueSeason: ILeagueSeason) => leagueSeason.id === newLeagueSeasonId) || null;
    dispatch(setPublicLeagueSeason(newLeagueSeason));
    setStoragePublicLeagueSeasonId(newLeagueSeasonId);
  }

  return (
    <AppBar position="sticky" color="transparent">
      <Paper color="primary">
        <LoaderInfo
          msgError={apiError}
        />
        { statePublicContext.leagues && statePublicContext.currentLeague && (
          <FormControl size="small">
            <Select
              labelId="label-switch-public-league"
              id="switch-public-league"
              value={(statePublicContext.currentLeague.id).toString()}
              onChange={handleLeagueChange}
            >
              {statePublicContext.leagues && statePublicContext.leagues.map((league:ILeague) => (
                <MenuItem 
                  key={`item-public-league-${league.id}`} 
                  value={league.id}
                >{league.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        { ( statePublicContext.leagueSeasons && statePublicContext.currentLeagueSeason ) ? (
          <FormControl size="small">
            <Select
              labelId="label-switch-public-season"
              id="switch-public-season"
              value={(statePublicContext.currentLeagueSeason.id).toString()}
              onChange={handleLeagueSeasonChange}
            >
              {statePublicContext.leagueSeasons.filter((leagueSeason: ILeagueSeason) => leagueSeason.idLeague === statePublicContext.currentLeague?.id).map((leagueSeason:ILeagueSeason) => (
                <MenuItem 
                  key={`item-public-league-season-${leagueSeason.id}`} 
                  value={leagueSeason.id}
                >{leagueSeason.year} {leagueSeason.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : ''}
      </Paper>
    </AppBar>
    
  )
}

export default ChangePublicLeague;