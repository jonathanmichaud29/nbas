import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, CardContent, CardHeader, Container, Grid } from "@mui/material";

import { auth, logout } from "../Firebase/firebase";
import LeagueSwitch from "../League/LeagueSwitch";

function DashboardHome() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/admin/login");
  }, [user, loading, navigate]);

  return (
    <>
      <Box p={3}>
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                  <CardHeader title="Hello admin!" component="h1" sx={{textAlign:"center"}} />
                </Grid>
                <Grid item>
                  <Button
                    onClick={logout}
                    variant="contained"
                  >Logout</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <LeagueSwitch />
    </>
  );
}

export default DashboardHome;