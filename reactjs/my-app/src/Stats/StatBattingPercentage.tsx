import { Box } from '@mui/material';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { IStatBattingPercentageProps } from '../Interfaces/stats';

import { chartColors } from '../utils/colorCodes'
import { sxGroupStyles } from '../utils/theme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Vertical Bar

function StatBattingPercentage(props: IStatBattingPercentageProps) {
  const { stats, columns} = props;

  const chartOptionsPercentage = {
    responsive: true,
    maintainAspectRatio:false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      /* title: {
        display: true,
        text: 'Batting % Stats',
      }, */
      
    },
    scales: {
      y: {
        beginAtZero:true,
        min: 0,
        suggestedMax: 1,
      }
    }
    
  };
  const labelsChart = columns;
  const dataChartBattingPercentage = {
    labels: labelsChart,
    datasets: [
      {
        label: 'Batting Average',
        data: labelsChart.map((label, index) => stats[index].battingAverage),
        backgroundColor: chartColors.battingAverage.bkg,
      },
      {
        label: 'On Base %',
        data: labelsChart.map((label, index) => stats[index].onBasePercentage),
        backgroundColor: chartColors.onBasePercentage.bkg,
      },
      {
        label: 'Slugging %',
        data: labelsChart.map((label, index) => stats[index].sluggingPercentage),
        backgroundColor: chartColors.sluggingPercentage.bkg,
      },
      {
        label: 'On Base Slugging %',
        data: labelsChart.map((label, index) => stats[index].onBaseSluggingPercentage),
        backgroundColor: chartColors.onBaseSluggingPercentage.bkg,
      },
    ],
  };

  return (
    <Box sx={sxGroupStyles.boxWrapperChart}>
      <Bar options={chartOptionsPercentage} data={dataChartBattingPercentage} />
    </Box>
  )
}

export default StatBattingPercentage;