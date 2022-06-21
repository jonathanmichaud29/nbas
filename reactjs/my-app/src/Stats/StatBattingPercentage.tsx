import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { IStatBattingPercentageProps, IBattingPercentageStats } from '../Interfaces/stats';
import { getStatIndexHits,getStatIndexSlugging } from '../utils/statsAggregation'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Vertical Bar

function StatBattingPercentage(props: IStatBattingPercentageProps) {
  const { single, double, triple, homerun, atBats, columns} = props;

  let stats = [] as IBattingPercentageStats[];
  columns.forEach((value, index) => {
    const nbHits = getStatIndexHits(index, single, double, triple, homerun);
    const sluggingTotal = getStatIndexSlugging(index, single, double, triple, homerun);
    
    stats.push({
      battingAverage: nbHits / atBats[index], // = Hit / AtBats
      /* onBasePercentage: 0.300, // = ( Hit + Walk + Hit by pitch ) / ( AtBats + Walk + Hit by pitch + Sacrifice Flies) */
      sluggingPercentage: sluggingTotal / atBats[index], // Single + (Double x 2) + (Triple x 3 ) + (Homerun x 4) / AtBats
      /* onBaseSluggingPercentage: 1.700, // OnBase + Slugging */
    });
    return true;
  })

  const chartOptionsPercentage = {
    responsive: true,
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
      /* {
        label: 'On Base %',
        data: labelsChart.map(() => stats.onBasePercentage),
        backgroundColor: 'rgba(0, 255, 200, 1)',
      }, */
      {
        label: 'Slugging %',
        data: labelsChart.map((label, index) => stats[index].sluggingPercentage),
        backgroundColor: 'rgba(0, 180, 255, 1)',
      },
      /* {
        label: 'On Base Slugging %',
        data: labelsChart.map(() => stats.onBaseSluggingPercentage),
        backgroundColor: 'rgba(0, 0, 255, 1)',
      }, */
    ],
  };

  return (
    <Bar options={chartOptionsPercentage} data={dataChartBattingPercentage} />
  )
}

export default StatBattingPercentage;