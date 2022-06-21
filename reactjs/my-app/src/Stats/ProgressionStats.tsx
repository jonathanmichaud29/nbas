import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { IProgressionStatsProps } from '../Interfaces/stats';
import { IBattingPercentageStats } from '../Interfaces/stats';

import { createShortDateReadable } from '../utils/dateFormatter';
import { getStatHits, getStatSlugging } from '../utils/statsAggregation'

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

function ProgressionStats(props: IProgressionStatsProps){

  const { matches, matchLineups } = props;

  const options = {
    responsive: true,
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

  let labels = [] as Array<string>;
  let stats = [] as IBattingPercentageStats[];

  matches.forEach((match) => {
    const matchLineup = matchLineups.find((tmpLineup) => tmpLineup.idMatch === match.id);
    if( matchLineup !== undefined) {
      labels.push(createShortDateReadable(match.date));

      const nbHits = getStatHits(matchLineup.single, matchLineup.double, matchLineup.triple, matchLineup.homerun);
      const sluggingTotal = getStatSlugging(matchLineup.single, matchLineup.double, matchLineup.triple, matchLineup.homerun);

      stats.push({
        battingAverage: nbHits / matchLineup.atBats,
        sluggingPercentage: sluggingTotal / matchLineup.atBats,
        /* onBasePercentage: 0.300, */
        /* onBaseSluggingPercentage: 1.700, */
      });
    }
  })
  const data = {
    labels,
    datasets: [
      {
        label: 'Batting Average',
        data: stats.map((stat) => stat.battingAverage),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Slugging %',
        data: stats.map((stat) => stat.sluggingPercentage),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Line options={options} data={data} />
  )
}

export default ProgressionStats;