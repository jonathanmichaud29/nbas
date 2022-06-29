import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { IStatBattingPercentageProps } from '../Interfaces/stats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Vertical Bar

function StatBattingPercentage(props: IStatBattingPercentageProps) {
  const { stats, columns} = props;

  const chartOptionsPercentage = {
    responsive: true,
    maintainAspectRatio:false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Batting % Stats',
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
  const labelsChart = columns;
  const dataChartBattingPercentage = {
    labels: labelsChart,
    datasets: [
      {
        label: 'Batting Average',
        data: labelsChart.map((label, index) => stats[index].battingAverage),
        backgroundColor: 'rgba(0, 255, 0, 1)',
      },
      {
        label: 'On Base %',
        data: labelsChart.map((label, index) => stats[index].onBasePercentage),
        backgroundColor: 'rgba(0, 255, 200, 1)',
      },
      {
        label: 'Slugging %',
        data: labelsChart.map((label, index) => stats[index].sluggingPercentage),
        backgroundColor: 'rgba(0, 180, 255, 1)',
      },
      {
        label: 'On Base Slugging %',
        data: labelsChart.map((label, index) => stats[index].onBaseSluggingPercentage),
        backgroundColor: 'rgba(0, 0, 255, 1)',
      },
    ],
  };

  return (
    <div style={{position:'relative', height:'300px'}}>
      <Bar options={chartOptionsPercentage} data={dataChartBattingPercentage} />
    </div>
  )
}

export default StatBattingPercentage;