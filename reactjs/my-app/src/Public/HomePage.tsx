
import MatchResume from "../Matchs/MatchResume";
import { Grid } from "@mui/material";

function HomePage() {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={5}>
        <MatchResume 
          title="Latest match"
          isLatestMatch={true}
        />
      </Grid>
      <Grid item xs={5}>
        <MatchResume 
          title="Upcoming match"
          isLatestMatch={false}
        />
      </Grid>
    </Grid>
    
  )
}
export default HomePage;