import { Paper, Box, Stack, Typography, Grid, Alert } from "@mui/material";

import { IMatch } from "../Interfaces/match";
import { IBattingStatsExtended } from "../Interfaces/stats";
import { ITeam } from "../Interfaces/team";

import CustomDataGrid from "../Generic/CustomDataGrid";
import StatBatResults from "../Stats/StatBatResults";
import StatBattingPercentage from "../Stats/StatBattingPercentage";

import { playerExtendedStatsColumns, defaultStateStatsColumns } from "../utils/dataGridColumns";

interface IMatchTeamStatsProps{
  match: IMatch;
  team: ITeam;
  teamStats: IBattingStatsExtended | null;
  dataGridRows: any;
}
export default function MatchTeamStats(props:IMatchTeamStatsProps){

  const {match, team, teamStats, dataGridRows} = props;
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center" >
        <Typography variant="h2" align="center">
          {team.name} Stats
        </Typography>
        { teamStats 
        ?
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
        : 
          <Alert severity="info">There is no stats for {team.name}</Alert>
        }
            
        {dataGridRows.length > 0 
        ? 
          <CustomDataGrid
            pageSize={10}
            rows={dataGridRows}
            columns={playerExtendedStatsColumns}
            initialState={defaultStateStatsColumns}
            getRowId={(row:any) => row.id + "-home-" + match.id}
          />
        : ''}
      </Stack>
    </Paper>
  )
}