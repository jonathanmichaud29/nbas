import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from "../Firebase/firebase";
import LeagueSwitch from "../League/LeagueSwitch";
import CreateLeague from "../League/CreateLeague";
import { useDispatch } from "react-redux";
import { resetLeaguePlayers } from "../redux/leaguePlayerSlice";
import { resetLeagues } from "../redux/leagueSlice";
import { resetLeagueTeams } from "../redux/leagueTeamSlice";
import { resetPlayers } from "../redux/playerSlice";
import { AppDispatch } from "../redux/store";
import { resetTeams } from "../redux/teamSlice";

function DashboardHome() {
  const dispatch = useDispatch<AppDispatch>();

  const triggerLogout = () => {
    dispatch(resetPlayers());
    dispatch(resetLeaguePlayers());
    dispatch(resetTeams());
    dispatch(resetLeagueTeams());
    dispatch(resetLeagues());
    logout();
  }

  return (
    <>
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
      <CreateLeague
      />
      <LeagueSwitch />
    </>
  );
}

export default DashboardHome;