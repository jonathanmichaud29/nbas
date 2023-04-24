import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Paper, AppBar, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { AppDispatch, RootState } from "../redux/store";
import { addAdminLeagues, addAdminLeagueSeasons, 
  setAdminLeague, setAdminLeagueSeason } from "../redux/adminContextSlice";

import { ILeague, ILeagueSeason } from "../Interfaces/league";
import { IApiFetchUserLeaguesParams, fetchUserLeagues } from "../ApiCall/users";

import { getStorageLeagueId, getStorageLeagueSeasonId } from "../utils/localStorage";

import LoaderInfo from "../Generic/LoaderInfo";
import { resetLeaguePlayers } from "../redux/leaguePlayerSlice";
import { resetLeagueTeams } from "../redux/leagueTeamSlice";
import { resetPlayers } from "../redux/playerSlice";
import { resetTeams } from "../redux/teamSlice";
import { batch } from "react-redux";
import { castNumber } from "../utils/castValues";

interface IChangeAdminLeague {
  
}
function ChangeAdminLeague(props:IChangeAdminLeague) {
  const dispatch = useDispatch<AppDispatch>();

  const currentLeagueId = getStorageLeagueId();
  const currentLeagueSeasonId = getStorageLeagueSeasonId();
  const stateAdminContext = useSelector((state: RootState) => state.adminContext )
  
  const [apiError, changeApiError] = useState('');

  useMemo(()=>{
    const paramsUserLeagues: IApiFetchUserLeaguesParams = {}
    fetchUserLeagues(paramsUserLeagues)
      .then(response => {
        if ( response.data.length === 0) {
          changeApiError("There is no league assigned to your profile. Please advised the admin");
          return;
        }

        
        let currentAdminLeague: ILeague | null = null;
        let currentAdminLeagueSeason: ILeagueSeason| null = null;

        response.data.leagues.every((league: ILeague) => {
          
          if( !currentLeagueId || currentLeagueId === league.id ){
            let newLeagueSeason = null;
            const listLeagueSeasons: ILeagueSeason[] = response.data.leagueSeasons || []
            if( listLeagueSeasons && listLeagueSeasons.length ){
              listLeagueSeasons
                .filter((leagueSeason)=>leagueSeason.idLeague === league.id)
                .sort((a,b) => b.id - a.id)
                .every((leagueSeason: ILeagueSeason) => {
                  if( !currentLeagueSeasonId || currentLeagueSeasonId === leagueSeason.id ){
                    newLeagueSeason = leagueSeason;
                    return false;
                  }
                  return true;
                })
              if( newLeagueSeason === null ){
                newLeagueSeason = listLeagueSeasons[0];
              }
            }
            currentAdminLeague = league;
            currentAdminLeagueSeason = newLeagueSeason
            
            window.localStorage.setItem("currentLeagueId", league.id.toString());
            window.localStorage.setItem("currentLeagueSeasonId", newLeagueSeason?.id.toString() || '0');

            return false;
          }
          return true;
        })
        
        batch(()=>{
          dispatch(addAdminLeagues(response.data.leagues));
          dispatch(addAdminLeagueSeasons(response.data.leagueSeasons));
          dispatch(setAdminLeague(currentAdminLeague));
          dispatch(setAdminLeagueSeason(currentAdminLeagueSeason));
        })
        
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() =>{
        
      })
  },[]);

  const handleLeagueChange = (event: SelectChangeEvent) => {
    const newLeagueId = castNumber(event.target.value);
    const newLeague = stateAdminContext.leagues.find((league: ILeague) => league.id === newLeagueId) || null;
    
    // Find latest season for the choosen league
    let newLeagueSeason: ILeagueSeason | null = null;
    const leagueSeasons = stateAdminContext.leagueSeasons.filter((leagueSeason: ILeagueSeason) => leagueSeason.idLeague === newLeagueId);
    if( leagueSeasons && leagueSeasons.length ){
      newLeagueSeason = leagueSeasons.sort((a,b) => b.id - a.id)[0];
    }

    // Dispatch new current League & Season
    
    
    window.localStorage.setItem("currentLeagueId", newLeagueId.toString());
    window.localStorage.setItem("currentLeagueSeasonId", newLeagueSeason?.id.toString() || '0');
    batch(() => {
      dispatch(setAdminLeague(newLeague));
      dispatch(setAdminLeagueSeason(newLeagueSeason));
      dispatch(resetPlayers());
      dispatch(resetLeaguePlayers());
      dispatch(resetTeams());
      dispatch(resetLeagueTeams()); 
    })
    
    // dispatch(resetLeagueSeasons());
  }

  const handleLeagueSeasonChange = (event: SelectChangeEvent) => {
    const newLeagueSeasonId = event.target.value as unknown as number;
    const newLeagueSeason = stateAdminContext.leagueSeasons.find((leagueSeason: ILeagueSeason) => leagueSeason.id === newLeagueSeasonId) || null;
    dispatch(setAdminLeagueSeason(newLeagueSeason));
    window.localStorage.setItem("currentLeagueSeasonId", newLeagueSeasonId.toString());
  }

  return (
    <AppBar position="sticky" color="transparent">
      <Paper color="primary">
        <LoaderInfo
          msgError={apiError}
        />
        { stateAdminContext.leagues && stateAdminContext.currentLeague && (
          <FormControl size="small">
            <Select
              labelId="label-switch-admin-league"
              id="switch-admin-league"
              value={(stateAdminContext.currentLeague.id).toString()}
              onChange={handleLeagueChange}
            >
              {stateAdminContext.leagues && stateAdminContext.leagues.map((league:ILeague) => (
                <MenuItem 
                  key={`item-admin-league-${league.id}`} 
                  value={league.id}
                >{league.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        { ( stateAdminContext.leagueSeasons && stateAdminContext.currentLeagueSeason ) ? (
          <FormControl size="small">
            <Select
              labelId="label-switch-admin-season"
              id="switch-admin-season"
              value={(stateAdminContext.currentLeagueSeason.id).toString()}
              onChange={handleLeagueSeasonChange}
            >
              {stateAdminContext.leagueSeasons.filter((leagueSeason: ILeagueSeason) => leagueSeason.idLeague === stateAdminContext.currentLeague?.id).map((leagueSeason:ILeagueSeason) => (
                <MenuItem 
                  key={`item-admin-league-season-${leagueSeason.id}`} 
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

export default ChangeAdminLeague;