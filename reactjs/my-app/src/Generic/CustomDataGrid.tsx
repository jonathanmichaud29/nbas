import { DataGrid, GridToolbar } from '@mui/x-data-grid';

interface ICustomDataGrid {
  pageSize:     number;
  rows:         any;
  columns:      any;
  initialState: any;
  getRowId:     any;
  hideFooter?:  boolean;
}

const defaultDataGridProps = {
  pageSizeOptions:[5,10,20,50],
  autoHeight:true,
  disableColumnMenu:true,
}

function CustomDataGrid(props: ICustomDataGrid) {

  let initialState = props.initialState;
  /* if (props.rows.length < 2){
    initialState.columns.columnVisibilityModel.playerName = false;
  } */
  initialState.pagination = {
    paginationModel:{
      pageSize:props.pageSize
    }
  }
  return (
    <DataGrid
      {...defaultDataGridProps}
      rows={props.rows}
      columns={props.columns}
      getRowId={props.getRowId}
      initialState={initialState}
      hideFooter={props.hideFooter || false}
      slots={{
        toolbar: GridToolbar
      }}
      sx={{
        width:'100%'
      }}
    />
  )
}

export default CustomDataGrid;