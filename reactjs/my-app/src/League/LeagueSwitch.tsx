import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Box, Paper, Typography, Stack } from "@mui/material";

import { AppDispatch, RootState } from "../redux/store";
import { resetPlayers } from '../redux/playerSlice';
import { resetLeaguePlayers } from "../redux/leaguePlayerSlice";
import { resetLeagueTeams } from "../redux/leagueTeamSlice";
import { resetTeams } from "../redux/teamSlice";
import { addLeagues } from "../redux/leagueSlice";
import { addAdminLeagues, addAdminLeagueSeasons } from "../redux/adminContextSlice";

import { ILeague } from "../Interfaces/league";

import { fetchUserLeagues, IApiFetchUserLeaguesParams } from "../ApiCall/users";

import LoaderInfo from "../Generic/LoaderInfo";

import { getStorageLeagueId } from "../utils/localStorage";
import { resetLeagueSeasons } from "../redux/leagueSeasonSlice";

function LeagueSwitch() {
  const dispatch = useDispatch<AppDispatch>();

  const currentLeagueId = getStorageLeagueId();

  const [apiError, changeApiError] = useState('');
  const [selectedLeague, setCurrentLeague] = useState<ILeague | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const listLeagues = useSelector((state: RootState) => state.leagues )

  const selectNewLeague = (league: ILeague) => {
    setCurrentLeague(league);
    window.localStorage.setItem("currentLeagueId", league.id.toString());
    window.localStorage.setItem("currentLeagueName", league.name);
    dispatch(resetPlayers());
    dispatch(resetLeaguePlayers());
    dispatch(resetTeams());
    dispatch(resetLeagueTeams());
    dispatch(resetLeagueSeasons());

  }

  if( ! isLoaded ){
    const paramsUserLeagues: IApiFetchUserLeaguesParams = {}
    fetchUserLeagues(paramsUserLeagues)
      .then(response => {
        setIsLoaded(true)
        if ( response.data.length === 0) {
          changeApiError("There is no league assigned to your profile. Please advised the admin");
          return;
        }

        dispatch(addLeagues(response.data.leagues));
        dispatch(addAdminLeagues(response.data.leagues));
        dispatch(addAdminLeagueSeasons(response.data.leagueSeasons));
        response.data.leagues.every((league: ILeague) => {
          if( currentLeagueId === 0  || currentLeagueId === league.id ){
            selectNewLeague(league);
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
  }
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">Change league management</Typography>
        <LoaderInfo
          isLoading={isLoaded}
          msgError={apiError}
        />
        { selectedLeague !== null && (
          <Typography variant="h6" component="h3">Current league: {selectedLeague.name}</Typography>
        )}
        {listLeagues.length > 0 && listLeagues.filter((league) => league.id !== selectedLeague?.id).map((league) => (
          <Button
            key={`league-switch-${league.id}`}
            variant={selectedLeague === league ? 'text' : 'contained'}
            onClick={() => selectNewLeague(league)}
            disabled={selectedLeague === league}
          >{league.name}</Button>
        ))}
      </Stack>
    </Paper>
  )
}
export default LeagueSwitch;
