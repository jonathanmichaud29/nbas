import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from "../Firebase/firebase";
import LeagueSwitch from "../League/LeagueSwitch";

function DashboardHome() {
  
  return (
    <>
      <Paper component={Box} p={3} m={3}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h1">Hello admin!</Typography>
          <Button
            startIcon={<LogoutIcon />}
            onClick={logout}
            variant="contained"
          >Logout</Button>
        </Stack>
      </Paper>
      <LeagueSwitch />
    </>
  );
}

export default DashboardHome;