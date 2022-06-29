import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { IProgressionStatsProps } from '../Interfaces/stats';
import { IBattingPercentageStats } from '../Interfaces/stats';

import { createShortDateReadable } from '../utils/dateFormatter';
import { getCombinedPlayersStats } from '../utils/statsAggregation'

import { chartColors } from '../utils/colorCodes'

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

function ProgressionStats(props: IProgressionStatsProps){

  const { matches, matchLineups } = props;

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

  let labels = [] as Array<string>;
  let stats = [] as IBattingPercentageStats[];

  matches.forEach((match) => {
    const matchLineup = matchLineups.find((tmpLineup) => tmpLineup.idMatch === match.id);
    if( matchLineup !== undefined) {
      // TODO: Should be "July 7 against X Team"
      labels.push(createShortDateReadable(match.date));

      stats.push(getCombinedPlayersStats([matchLineup])[0])

      /* const nbHits = getStatHits(matchLineup.single, matchLineup.double, matchLineup.triple, matchLineup.homerun);
      const sluggingTotal = getStatSlugging(matchLineup.single, matchLineup.double, matchLineup.triple, matchLineup.homerun);

      stats.push({
        battingAverage: nbHits / matchLineup.atBats,
        sluggingPercentage: sluggingTotal / matchLineup.atBats,
        onBasePercentage: 0.300,
        onBaseSluggingPercentage: 1.700,
      }); */
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
    <div style={{position:'relative', height:'300px'}}>
      <Line options={options} data={data} />
    </div>
  )
}

export default ProgressionStats;