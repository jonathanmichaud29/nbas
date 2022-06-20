import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend); // Doughnut

interface IPlayerStatBatResults {
  single: number;
  double: number;
  triple: number;
  homerun: number;
  out: number;
}

function StatBatResults(props: IPlayerStatBatResults) {
  const { single, double, triple, homerun, out} = props;

  const dataChartAtBats = {
    labels: ['Single', 'Double', 'Triple', 'Homerun', 'Out'],
    datasets: [
      {
        label: 'At bats',
        data: [single, double, triple, homerun, out],
        backgroundColor: [
          'rgba(0, 255, 0, 1)',
          'rgba(0, 255, 200, 1)',
          'rgba(0, 180, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(255, 0, 0, 1)',
        ],
        borderColor: [
          'rgba(0, 180, 0, 1)',
          'rgba(0, 180, 140, 1)',
          'rgba(0, 130, 180, 1)',
          'rgba(0, 0, 180, 1)',
          'rgba(180, 0, 0, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Doughnut data={dataChartAtBats} />
  )
}

export default StatBatResults;