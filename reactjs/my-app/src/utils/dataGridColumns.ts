import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export const playerStatsColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', hide: true},
  {
    field: 'playerName',
    headerName: 'Player Name',
    width: 300
  },
  {
    field: 'atBats',
    headerName: 'At Bats',
    type: 'number',
  },
  {
    field: 'out',
    headerName: 'Out',
    type: 'number',
  },
  {
    field: 'single',
    headerName: 'Single',
    type: 'number',
  },
  {
    field: 'double',
    headerName: 'Double',
    type: 'number',
  },
  {
    field: 'triple',
    headerName: 'Triple',
    type: 'number',
  },
  {
    field: 'homerun',
    headerName: 'Homerun',
    type: 'number',
  },
];

export const playerExtendedStatsColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', hide: true},
  {
    field: 'playerName',
    headerName: 'Player Name',
    width: 300
  },
  {
    field: 'atBats',
    headerName: 'At Bats',
    type: 'number',
  },
  {
    field: 'out',
    headerName: 'Out',
    type: 'number',
  },
  {
    field: 'single',
    headerName: 'Single',
    type: 'number',
  },
  {
    field: 'double',
    headerName: 'Double',
    type: 'number',
  },
  {
    field: 'triple',
    headerName: 'Triple',
    type: 'number',
  },
  {
    field: 'homerun',
    headerName: 'Homerun',
    type: 'number',
  },
  {
    field: 'battingAverage',
    headerName: 'Batting AVG',
    type: 'number',
    description: "Batting Average = Total Successful hits (single, double, triple, homerun) divided by the number of times a hit occured",
  },
  {
    field: 'sluggingPercentage',
    headerName: 'Slugging %',
    type: 'number',
    description: "Slugging Percentage = Total Hits value ( Single + Double*2 + Triple*3 + Homerun*4 ) divided by the number of times a hit occured",
  },
];