import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { Box, FormControlLabel, Grid, Switch, Typography } from '@mui/material';

import { colorHex, colorRgb } from '../utils/colorCodes'
import { castNumber } from '../utils/castValues';
import { IPlayer } from '../Interfaces/player';
import { IBattingStatsExtended } from '../Interfaces/stats';
import { ITeam } from '../Interfaces/team';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

const statPercentageOptions = [
  "Batting Average", 
  "On Base %", 
  "Slugging %", 
  "On Base Slugging %",
]
const statCumulativeOptions = [
  "Single",
  "Double",
  "Triple",
  "Homerun",
  "Out",
  "RBI"
]

interface ICompareBattingStatsProps {
  battingStats: IBattingStatsExtended[];
  players?:IPlayer[];
  teams?:ITeam[];
}
function CompareBattingStats(props: ICompareBattingStatsProps){

  const { battingStats, players, teams } = props;

  const [shownPercentageStats, setShownPercentageStats] = useState<Array<number>>(statPercentageOptions.map((option, index) => index))
  const [shownCumulativeStats, setShownCumulativeStats] = useState<Array<number>>(statCumulativeOptions.map((option, index) => index))

  let percentageLabels: Array<Array<string>> = [];
  let percentageDatasets: Array<any> = []
  let cumulativeLabels: Array<Array<string>> = [];
  let cumulativeDatasets: Array<any> = []

  shownPercentageStats.forEach((value) => {
    percentageLabels.push([statPercentageOptions[value]])
  })
  shownCumulativeStats.forEach((value) => {
    cumulativeLabels.push([statCumulativeOptions[value]])
  })
  
  players?.forEach((player, index) => {
    const playerBattingStats = battingStats.find((battingStat) => battingStat.id === player.id);
    if( playerBattingStats !== undefined ) {
      let dataFiltered: Array<number> = [];
      shownPercentageStats.forEach((statIndex) => {
        const labelStat = statPercentageOptions[statIndex]
        let statNumber = 0;
        
        switch(labelStat){
          case "Batting Average": 
            statNumber = playerBattingStats.battingAverage;
            break;
          case "On Base %": 
            statNumber = playerBattingStats.onBasePercentage;
            break; 
          case "Slugging %": 
            statNumber = playerBattingStats.sluggingPercentage;
            break; 
          case "On Base Slugging %": 
            statNumber = playerBattingStats.onBaseSluggingPercentage;
            break;
        }
        dataFiltered.push(statNumber);
      })
      percentageDatasets.push({
        label: player.name,
        data: dataFiltered,
        borderColor: colorHex(index),
        backgroundColor: colorRgb(index, 0.5),
        
      })

      dataFiltered = [];
      shownCumulativeStats.forEach((statIndex) => {
        const labelStat = statCumulativeOptions[statIndex]
        let statNumber = 0;
        switch(labelStat){
          case "Single": 
            statNumber = playerBattingStats.single;
            break;
          case "Double": 
            statNumber = playerBattingStats.double;
            break; 
          case "Triple": 
            statNumber = playerBattingStats.triple;
            break; 
          case "Homerun": 
            statNumber = playerBattingStats.homerun;
            break;
          case "Out": 
            statNumber = playerBattingStats.out;
            break;
          case "RBI": 
            statNumber = playerBattingStats.runsBattedIn;
            break;
        }
        dataFiltered.push(statNumber);
      })
      cumulativeDatasets.push({
        label: player.name,
        data: dataFiltered,
        borderColor: colorHex(index),
        backgroundColor: colorRgb(index, 0.5),
        
      })

    }
  })

  teams?.forEach((team, index) => {
    const teamBattingStats = battingStats.find((battingStat) => battingStat.id === team.id);
    if( teamBattingStats !== undefined ) {
      let dataFiltered: Array<number> = [];
      shownPercentageStats.forEach((statIndex) => {
        const labelStat = statPercentageOptions[statIndex]
        let statNumber = 0;
        
        switch(labelStat){
          case "Batting Average": 
            statNumber = teamBattingStats.battingAverage;
            break;
          case "On Base %": 
            statNumber = teamBattingStats.onBasePercentage;
            break; 
          case "Slugging %": 
            statNumber = teamBattingStats.sluggingPercentage;
            break; 
          case "On Base Slugging %": 
            statNumber = teamBattingStats.onBaseSluggingPercentage;
            break;
        }
        dataFiltered.push(statNumber);
      })
      percentageDatasets.push({
        label: team.name,
        data: dataFiltered,
        borderColor: colorHex(index),
        backgroundColor: colorRgb(index, 0.5),
        
      })

      dataFiltered = [];
      shownCumulativeStats.forEach((statIndex) => {
        const labelStat = statCumulativeOptions[statIndex]
        let statNumber = 0;
        switch(labelStat){
          case "Single": 
            statNumber = teamBattingStats.single;
            break;
          case "Double": 
            statNumber = teamBattingStats.double;
            break; 
          case "Triple": 
            statNumber = teamBattingStats.triple;
            break; 
          case "Homerun": 
            statNumber = teamBattingStats.homerun;
            break;
          case "Out": 
            statNumber = teamBattingStats.out;
            break;
          case "RBI": 
            statNumber = teamBattingStats.runsBattedIn;
            break;
        }
        dataFiltered.push(statNumber);
      })
      cumulativeDatasets.push({
        label: team.name,
        data: dataFiltered,
        borderColor: colorHex(index),
        backgroundColor: colorRgb(index, 0.5),
        
      })

    }
  })
  
  

  const switchShownPercentageStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = castNumber(event.target.value);
    if( event.target.checked ){
      setShownPercentageStats([...shownPercentageStats, index])
    }
    else {
      setShownPercentageStats(shownPercentageStats.filter((stat) => stat !== index));
    }
  }
  const switchShownCumulativeStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = castNumber(event.target.value);
    if( event.target.checked ){
      setShownCumulativeStats([...shownCumulativeStats, index])
    }
    else {
      setShownCumulativeStats(shownCumulativeStats.filter((stat) => stat !== index));
    }
  }

  /**
   * ChartJS Parameters
   */
  const options = {
    responsive: true,
    maintainAspectRatio:false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${teams !== undefined ? 'Teams' : 'Players'} comparison`,
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

  const dataPercentage = {
    labels:percentageLabels,
    datasets:percentageDatasets
  };

  const dataCumulative = {
    labels:cumulativeLabels,
    datasets:cumulativeDatasets
  };

  return (
    <>
      <Box width="100%">
        <Typography variant="h2" textAlign="center">Average Stats</Typography>
        <Grid container flexDirection="row" flexWrap="wrap" alignItems="center" justifyContent="space-around">
          {statPercentageOptions.map((statOption, index) => {
            return (
              <Grid item key={`stat-control-${index}`} xs={12} sm={6} md={3}>
                <FormControlLabel 
                  control={
                    <Switch 
                      value={index}
                      checked={shownPercentageStats.includes(index)}
                      onChange={switchShownPercentageStats}
                    />
                  } 
                  label={statOption} 
                />
              </Grid>
            )
          })}
        
        </Grid>
      </Box>
      <Box sx={{position:'relative', height:'300px', width:'100%'}}>
        <Bar options={options} data={dataPercentage} />
      </Box>

      <Box width="100%">
        <Typography variant="h2" textAlign="center">Cumulative Stats</Typography>
        <Grid container flexDirection="row" flexWrap="wrap" alignItems="center" justifyContent="space-around">
          {statCumulativeOptions.map((statOption, index) => {
            return (
              <Grid item key={`stat-cumulative-${index}`} xs={6} sm={4}>
                <FormControlLabel 
                  control={
                    <Switch 
                      value={index}
                      checked={shownCumulativeStats.includes(index)}
                      onChange={switchShownCumulativeStats}
                    />
                  } 
                  label={statOption} 
                />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <Box sx={{position:'relative', height:'300px', width:'100%'}}>
        <Bar options={options} data={dataCumulative} />
      </Box>
    </>
  )
}

export default CompareBattingStats;