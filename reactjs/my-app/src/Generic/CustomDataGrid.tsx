import { useState } from 'react';
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
  rowsPerPageOptions:[5,10,20,50],
  autoHeight:true,
  disableColumnMenu:true,
}

function CustomDataGrid(props: ICustomDataGrid) {

  const [pageSize, setPageSize] = useState<number>(props.pageSize)

  let initialState = props.initialState;
  if (props.rows.length < 2){
    /* initialState.columns.columnVisibilityModel.playerName = false; */
  }
  return (
    <DataGrid
      {...defaultDataGridProps}
      pageSize={pageSize}
      onPageSizeChange={(newPage) => setPageSize(newPage)}
      rows={props.rows}
      columns={props.columns}
      getRowId={props.getRowId}
      initialState={initialState}
      hideFooter={props.hideFooter || false}
      components={{
        Toolbar: GridToolbar
      }}
      sx={{
        width:'100%'
      }}
    />
  )
}

export default CustomDataGrid;