import { Link } from '@mui/material';

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IconButton } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { listLinks, quickLinkPlayer } from '../utils/constants';

const columnWidth = {
  xs: 75,
  sm: 100,
  md: 150,
  lg: 200,
  xl: 300,
}

export const playerExtendedStatsColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID'},
  {
    field: 'playerName',
    headerName: 'Player',
    width: columnWidth.lg,
    hideable:false,
  },
  {
    field: 'atBats',
    headerName: 'AB',
    type: 'number',
    width: columnWidth.xs,
    description: "At Bats = Trips to the plate that do no result in a walk, hit by pitch, sacrifice or reach on interference",
  },
  {
    field: 'out',
    headerName: 'Out',
    type: 'number',
    width: columnWidth.xs,
    description: "When a batter cannot reach safely one base"
  },
  {
    field: 'single',
    headerName: '1B',
    type: 'number',
    width: columnWidth.xs,
    description: "When a batter reaches on a hit and stops at the first base"
  },
  {
    field: 'double',
    headerName: '2B',
    type: 'number',
    width: columnWidth.xs,
    description: "When a batter reaches on a hit and stops at the second base"
  },
  {
    field: 'triple',
    headerName: '3B',
    type: 'number',
    width: columnWidth.xs,
    description: "When a batter reaches on a hit and stops at the third base"
  },
  {
    field: 'homerun',
    headerName: 'HR',
    type: 'number',
    width: columnWidth.xs,
    description: "Home Runs = When a batter reaches on a hit, touches all bases, and scores a run without a putout recorded or the benefit of error."
  },
  {
    field: 'runsBattedIn',
    headerName: 'RBI',
    type: 'number',
    width: columnWidth.sm,
    description: "Runs Batted In = Runs which score because of the batter's safe hit, sac bunt, sac fly, infield out or fielder's choice or is forced to score by a bases loaded walk, hit batter, or interference."
  },
  {
    field: 'battingAverage',
    headerName: 'AVG',
    type: 'number',
    width: columnWidth.sm,
    description: "Batting Average = Total Successful hits (single, double, triple, homerun) divided by the number of times a hit occured",
  },
  {
    field: 'onBasePercentage',
    headerName: 'OBP',
    type: 'number',
    width: columnWidth.sm,
    description: "On Base Percentage = The rate at which a batter reached base in his plate appearances. Formula: (Hit + Walk + Hit by pitch) / (At Bats + Walk + Hit by pitch + Sacrifice Fly)",
  },
  {
    field: 'sluggingPercentage',
    headerName: 'SLG',
    type: 'number',
    width: columnWidth.sm,
    description: "Slugging Percentage = The rate of total bases per at at bat. Formula : ( Single + Double*2 + Triple*3 + Homerun*4 ) / At Bats",
  },
  {
    field: 'onBaseSluggingPercentage',
    headerName: 'OPS',
    type: 'number',
    width: columnWidth.sm,
    description: "On-Base Plus Slugging = The sum of 'On-Base Percentage' and 'Slugging Percentage'",
  },
  {
    field: 'actions',
    headerName: 'Links',
    renderCell: (params: GridRenderCellParams<any>) => {
      return (
        <IconButton 
          key={`action-view-player-${params.row.id}`}
          aria-label={`${params.row.playerName} Profile`}
          title={`${params.row.playerName} Profile`}
          >
          <Link href={`${quickLinkPlayer.link}/${params.row.id}`}>
            <AccountBoxIcon />
          </Link>
        </IconButton>
      )
    }
  }
];

export const defaultStateStatsColumns = {
  columns: {
    columnVisibilityModel: {
      id: false,
      atBats: false,
      out: false,
      onBasePercentage:false,
    },
  },
}

export const defaultDataGridProps = {
  pageSize:5,
  rowsPerPageOptions:[5,10,20,50],
  autoHeight:true,
  disableColumnMenu:true,
}