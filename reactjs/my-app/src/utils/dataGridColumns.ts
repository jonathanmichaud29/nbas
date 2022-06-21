import { GridColDef} from '@mui/x-data-grid';

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