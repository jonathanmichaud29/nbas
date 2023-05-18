import { useState, useEffect } from 'react';
import { batch } from 'react-redux';

import { Grid, Stack, Typography } from "@mui/material";

import { usePublicContext } from '../Public/PublicApp';

import { IBattingStatsExtended, defaultBattingStatsExtended } from '../Interfaces/stats';
import { IMatchLineup } from '../Interfaces/match';
import { IPlayer } from '../Interfaces/player';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';
import CustomDataGrid from '../Generic/CustomDataGrid';

import { playerExtendedStatsColumns, defaultStateStatsColumns } from '../utils/dataGridColumns'
import { generateDatagridPlayerRows, getCombinedPlayersStats, getCombinedStats } from '../utils/statsAggregation'

interface IYearStatsProps {
  matchLineups:   IMatchLineup[];
  players:        IPlayer[];
  title:          string;
}

function YearStats(props: IYearStatsProps) {

  const {matchLineups, players, title} = props;

  const { leagueSeason } = usePublicContext();

  const idLeagueSeason = leagueSeason.id;

  const [allStats, setAllStats] = useState<IBattingStatsExtended>(defaultBattingStatsExtended);
  const [allPlayerStats, setAllPlayerStats] = useState<IBattingStatsExtended[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    const playersStats: IBattingStatsExtended[] = getCombinedPlayersStats(matchLineups);
    const mergeStats = getCombinedStats(matchLineups);
    batch(() => {
      setAllStats(mergeStats);
      setAllPlayerStats(playersStats);
      setDataLoaded(true);
    })
    
  }, [matchLineups]);

  const rows = generateDatagridPlayerRows(allPlayerStats, players, idLeagueSeason)
  
  if( ! dataLoaded) return (<></>);
  return (
    <Stack alignItems="center" width="100%" spacing={3}>
      <Typography variant="h3">{title}</Typography>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <StatBatResults
            single={allStats.single}
            double={allStats.double}
            triple={allStats.triple}
            homerun={allStats.homerun}
            out={allStats.out}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatBattingPercentage
            stats={[allStats]}
            columns={["Season Statistics"]}
          />
        </Grid>
      </Grid>
          
      { rows.length > 0 && (
        <CustomDataGrid
          pageSize={20}
          rows={rows}
          columns={playerExtendedStatsColumns}
          getRowId={(row:any) => row.playerName}
          initialState={defaultStateStatsColumns}
          hideFooter={rows.length <= 20}
        />
      )}
    </Stack>
  )

}

export default YearStats;