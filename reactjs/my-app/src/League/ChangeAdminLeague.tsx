import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Paper, AppBar, Alert, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { AppDispatch, RootState } from "../redux/store";
import { addAdminLeagues, addAdminLeagueSeasons, 
  setAdminLeague, setAdminLeagueSeason } from "../redux/adminContextSlice";

import { ILeague, ILeagueSeason } from "../Interfaces/league";
import { IApiFetchUserLeaguesParams, fetchUserLeagues } from "../ApiCall/users";

import { getStorageLeagueId, getStorageLeagueSeasonId } from "../utils/localStorage";

import LoaderInfo from "../Generic/LoaderInfo";

interface IChangeAdminLeague {
  /* leagues?:ILeague[];
  defaultLeagueId?:number;
  hideAllLeagueOption?:boolean;
  playersLeagues?:ILeaguePlayer[];
  onLeagueChange?(idLeague: number): void; */
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

        dispatch(addAdminLeagues(response.data.leagues));
        dispatch(addAdminLeagueSeasons(response.data.leagueSeasons));
        
        response.data.leagues.every((league: ILeague) => {
          if( currentLeagueId === null  || currentLeagueId === league.id ){
            let newLeagueSeason = null;
            if( response.data.leagueSeasons && response.data.leagueSeasons.length ){
              response.data.leagueSeasons.every((leagueSeason: ILeagueSeason) => {
                if( currentLeagueSeasonId === null  || currentLeagueSeasonId === leagueSeason.id ){
                  newLeagueSeason = leagueSeason;
                  return false;
                }
                return true;
              })
              if( newLeagueSeason === null ){
                newLeagueSeason = response.data.leagueSeasons[0];
              }
            }
            dispatch(setAdminLeague(league));
            dispatch(setAdminLeagueSeason(newLeagueSeason));

            window.localStorage.setItem("currentLeagueId", league.id.toString());
            window.localStorage.setItem("currentLeagueSeasonId", newLeagueSeason.id.toString());

            return false;
          }
          return true;
        })
      })
      .catch((error) => {
        changeApiError(error);
      })
      .finally(() =>{
        
      })
  },[]);

  const handleLeagueChange = (event: SelectChangeEvent) => {
    const newLeagueId = event.target.value as unknown as number;
    const newLeague = stateAdminContext.leagues.find((league: ILeague) => league.id === newLeagueId) || null;
    dispatch(setAdminLeague(newLeague));
    let newLeagueSeason = null;
    const leagueSeasons = stateAdminContext.leagueSeasons.filter((leagueSeason: ILeagueSeason) => leagueSeason.idLeague === newLeagueId);
    if( leagueSeasons && leagueSeasons.length ){
      newLeagueSeason = leagueSeasons[0];
    }
    dispatch(setAdminLeagueSeason(newLeagueSeason));
    
    window.localStorage.setItem("currentLeagueId", newLeagueId.toString());
    window.localStorage.setItem("currentLeagueSeasonId", newLeagueSeason?.id.toString() || '0');
    
    /* dispatch(resetPlayers());
    dispatch(resetLeaguePlayers());
    dispatch(resetTeams());
    dispatch(resetLeagueTeams());
    dispatch(resetLeagueSeasons()); */
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
              value={stateAdminContext.currentLeague.id as unknown as string}
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
              value={stateAdminContext.currentLeagueSeason.id as unknown as string}
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