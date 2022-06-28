
import ListTeams from "../Teams/ListTeams";
import ListPlayers from "../Players/ListPlayers";
import ListMatches from "../Matchs/ListMatches";

import MatchResume from "../Matchs/MatchResume";
import { Grid } from "@mui/material";

function HomePage() {
  return (
    <Grid container>
      <Grid item xs={6}>
        <MatchResume 
          title="Latest match"
          isLatestMatch={true}
        />
      </Grid>
      <Grid item xs={6}>
        <MatchResume 
          title="Upcoming match"
          isLatestMatch={false}
        />
      </Grid>
    </Grid>
    
  )
}
export default HomePage;