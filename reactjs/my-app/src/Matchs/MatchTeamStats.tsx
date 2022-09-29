import { Paper, Box, Stack, Typography, Grid } from "@mui/material";

import { IMatchTeamStatsProps } from "../Interfaces/match";

import CustomDataGrid from "../Generic/CustomDataGrid";
import StatBatResults from "../Stats/StatBatResults";
import StatBattingPercentage from "../Stats/StatBattingPercentage";

import { playerExtendedStatsColumns, defaultStateStatsColumns } from "../utils/dataGridColumns";

export default function MatchTeamStats(props:IMatchTeamStatsProps){

  const {match, team, teamStats, dataGridRows} = props;
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center" >
        <Typography variant="h2" align="center">
          {team.name} Stats
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <StatBatResults
              single={teamStats.single}
              double={teamStats.double}
              triple={teamStats.triple}
              homerun={teamStats.homerun}
              out={teamStats.out}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatBattingPercentage
              stats={[teamStats]}
              columns={[`${team.name} stats`]}
            />
          </Grid>
        </Grid>
            
        {dataGridRows.length > 0 && (
          <CustomDataGrid
            pageSize={10}
            rows={dataGridRows}
            columns={playerExtendedStatsColumns}
            initialState={defaultStateStatsColumns}
            getRowId={(row:any) => row.id + "-home-" + match.id}
          />
        )}
      </Stack>
    </Paper>
  )
}