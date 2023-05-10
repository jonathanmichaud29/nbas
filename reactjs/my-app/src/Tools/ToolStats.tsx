import { Paper, Box, Stack, Typography } from "@mui/material";

import { ILeagueSeason } from "../Interfaces/league";

import ToolComparePlayers from "./ToolComparePlayers";
import ToolCompareTeams from "./ToolCompareTeams";
import { ICompareCategory } from "./ToolCategoryCompare";

interface IToolStatsProps{
  leagueSeason:ILeagueSeason;
  category:ICompareCategory;
}

export default function ToolStats(props: IToolStatsProps){
  
  const {leagueSeason, category} = props;
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h1">Compare Statistics</Typography>
        
        { category === "player" && (
          <ToolComparePlayers
            leagueSeason={leagueSeason}
          />
        )}

        { category === "team" && (
          <ToolCompareTeams
            leagueSeason={leagueSeason}
          />
        )}
        
      </Stack>
    </Paper>
  )
}
