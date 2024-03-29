import { useDispatch } from "react-redux";
import { batch } from "react-redux";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from "../Firebase/firebase";

import { AppDispatch } from "../redux/store";
import { resetLeaguePlayers } from "../redux/leaguePlayerSlice";
import { resetLeagues } from "../redux/leagueSlice";
import { resetLeagueTeams } from "../redux/leagueTeamSlice";
import { resetPlayers } from "../redux/playerSlice";
import { resetTeams } from "../redux/teamSlice";
import { resetLeagueSeasons } from "../redux/leagueSeasonSlice";

import AdminMenu from "../Menu/AdminMenu";
import SelectAdminLeague from "../League/SelectAdminLeague";
import CreateLeague from "../League/CreateLeague";

function DashboardHome() {
  const dispatch = useDispatch<AppDispatch>();

  const triggerLogout = () => {
    batch(() => {
      dispatch(resetPlayers());
      dispatch(resetLeaguePlayers());
      dispatch(resetTeams());
      dispatch(resetLeagueTeams());
      dispatch(resetLeagues());
      dispatch(resetLeagueSeasons());
      logout();
    })
  }

  return (
    <>
      <AdminMenu />
      
      <Paper component={Box} p={3} m={3}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h1">Hello admin!</Typography>
          <Button
            startIcon={<LogoutIcon />}
            onClick={triggerLogout}
            variant="contained"
          >Logout</Button>
        </Stack>
      </Paper>

      <SelectAdminLeague />
      
      <CreateLeague />
    </>
  );
}

export default DashboardHome;