import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { IProgressionStatsProps } from '../Interfaces/stats';
import { IBattingPercentageStats } from '../Interfaces/stats';

import { createShortDateReadable } from '../utils/dateFormatter';
import { getCombinedPlayersStats } from '../utils/statsAggregation'

import { chartColors } from '../utils/colorCodes'
import { Box } from '@mui/material';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

function ProgressionStats(props: IProgressionStatsProps){

  const { matches, matchLineups, teams } = props;

  const options = {
    responsive: true,
    maintainAspectRatio:false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Player progression through matches played',
      },
    },
    scales: {
      y: {
        beginAtZero:true,
        min: 0,
        suggestedMax: 1,
      }
    }
  };

  let labels = [] as Array<Array<string>>;
  let stats = [] as IBattingPercentageStats[];

  matches.forEach((match) => {
    const matchLineup = matchLineups.find((tmpLineup) => tmpLineup.idMatch === match.id);
    const teamHome = teams.find((team) => team.id === match.idTeamHome);
    const teamAway = teams.find((team) => team.id === match.idTeamAway);
    if( matchLineup !== undefined && teamHome !== undefined && teamAway !== undefined) {
      
      // TODO: Should be "July 7 against X Team"
      labels.push([createShortDateReadable(match.date), teamHome.name, ' receives ', teamAway.name]);

      stats.push(getCombinedPlayersStats([matchLineup])[0])

    }
  })
  const data = {
    labels,
    datasets: [
      {
        label: 'Batting Average',
        data: stats.map((stat) => stat.battingAverage),
        borderColor: chartColors.battingAverage.bkg,
        backgroundColor: chartColors.battingAverage.bkg,
      },
      {
        label: 'On Base %',
        data: stats.map((stat) => stat.onBasePercentage),
        borderColor: chartColors.onBasePercentage.bkg,
        backgroundColor: chartColors.onBasePercentage.bkg,
      },
      {
        label: 'Slugging %',
        data: stats.map((stat) => stat.sluggingPercentage),
        borderColor: chartColors.sluggingPercentage.bkg,
        backgroundColor: chartColors.sluggingPercentage.bkg,
      },
      {
        label: 'On Base Slugging %',
        data: stats.map((stat) => stat.onBaseSluggingPercentage),
        borderColor: chartColors.onBaseSluggingPercentage.bkg,
        backgroundColor: chartColors.onBaseSluggingPercentage.bkg,
      },
    ],
  };

  return (
    <Box sx={{position:'relative', height:'300px', width:'100%'}}>
      <Line options={options} data={data} />
    </Box>
  )
}

export default ProgressionStats;