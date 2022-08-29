
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';

interface ICustomDataGrid {
  pageSize:     number;
  rows:         any;
  columns:      any;
  initialState: any;
  getRowId:     any;
}

const defaultDataGridProps = {
  rowsPerPageOptions:[5,10,20,50],
  autoHeight:true,
  disableColumnMenu:true,
}

function CustomDataGrid(props: ICustomDataGrid) {

  const [pageSize, setPageSize] = useState<number>(props.pageSize)

  return (
    <DataGrid
      {...defaultDataGridProps}
      pageSize={pageSize}
      onPageSizeChange={(newPage) => setPageSize(newPage)}
      rows={props.rows}
      columns={props.columns}
      getRowId={props.getRowId}
      initialState={props.initialState}
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