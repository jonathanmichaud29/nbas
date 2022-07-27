import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Alert, Button, Box, Card, CardHeader, Container, Grid } from "@mui/material";

import { ILeague } from "../Interfaces/league";

import { fetchUserLeagues } from "../ApiCall/users";

import { AppDispatch } from "../redux/store";
import { resetPlayers } from '../redux/playerSlice';
import { resetLeaguePlayers } from "../redux/leaguePlayerSlice";

import { updateAxiosBearer } from "../utils/axios";
import { getStorageLeagueId } from "../utils/localStorage";

function LeagueSwitch() {
  const dispatch = useDispatch<AppDispatch>();

  const [messageError, setMessageError] = useState('');
  const [selectedLeague, setCurrentLeague] = useState<ILeague | null>(null);
  const [leagues, setLeagues] = useState<ILeague[] | null>(null);

  const isLoaded = leagues !== null;

  const selectNewLeague = (league: ILeague) => {
    setCurrentLeague(league);
    window.localStorage.setItem("currentLeagueId", league.id.toString());
    window.localStorage.setItem("currentLeagueName", league.name);
    updateAxiosBearer();
    dispatch(resetPlayers());
    dispatch(resetLeaguePlayers());
  }

  useEffect(() => {
    fetchUserLeagues({})
      .then(response => {
        setLeagues(response.data);
        const currentLeagueId = getStorageLeagueId();
        if ( response.data.length === 0) {
          setMessageError("There is no league assigned to your profile. Please advised the admin");
        }
        else {
          response.data.every((league: ILeague) => {
            if( currentLeagueId === 0  || currentLeagueId === league.id ){
              selectNewLeague(league);
              return false;
            }
            return true;
          })
        }
      })
  }, [])

  
  
  return (
    <Box p={3}>
      <Container maxWidth="sm">
        <Card>
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <CardHeader title="Switch league management" component="h1" />
            </Grid>
            { messageError && (
              <Grid item pb={3}>
                <Alert severity="error">{messageError}</Alert>
              </Grid>
            )}
            {isLoaded && leagues.map((league) => (
              <Grid item pb={3} key={`select-league-${league.id}`}>
                <Button
                  variant={selectedLeague === league ? 'outlined' : 'contained'}
                  onClick={() => selectNewLeague(league)}
                  disabled={selectedLeague === league}
                >{league.name}</Button>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Container>
    </Box>
  )
}
export default LeagueSwitch;