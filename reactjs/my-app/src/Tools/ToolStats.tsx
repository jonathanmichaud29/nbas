import { Paper, Box, Stack, Typography } from "@mui/material";

import { ILeague } from "../Interfaces/league";

import ToolComparePlayers from "./ToolComparePlayers";
import ToolCompareTeams from "./ToolCompareTeams";

interface IToolStatsProps{
  league:ILeague;
  category:string;
}

export default function ToolStats(props: IToolStatsProps){
  
  const {league, category} = props;
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h1">Compare Statistics</Typography>
        
        { category === "player" && (
          <ToolComparePlayers
            league={league}
          />
        )}

        { category === "team" && (
          <ToolCompareTeams
            league={league}
          />
        )}
        
      </Stack>
    </Paper>
  )
}
