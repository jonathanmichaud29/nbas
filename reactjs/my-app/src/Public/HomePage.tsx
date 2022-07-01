
import MatchResume from "../Matchs/MatchResume";
import { Box, Grid } from "@mui/material";

function HomePage() {
  return (
    <Box p={3}>
      <Grid container spacing={4} justifyContent="space-around">
        <Grid item sm={12} md={6}  width="100%">
          <MatchResume 
            title="Latest match"
            isLatestMatch={true}
          />
        </Grid>
        <Grid item sm={12} md={6}  width="100%">
          <MatchResume 
            title="Upcoming match"
            isLatestMatch={false}
          />
        </Grid>
      </Grid>
    </Box>
    
  )
}
export default HomePage;