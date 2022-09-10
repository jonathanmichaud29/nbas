import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const defaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#751e1e',
      light: '#ffffff',
      dark: '#5c2828',
    },
    secondary: {
      main: '#d41717',
    },
    background: {
      default: '#e6e6e6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2.25rem',
    },
    h3: {
      fontSize: '2rem',
    },
    h4: {
      fontSize: '1.75rem',
    },
    h5: {
      fontSize: '1.5rem',
    },
    h6: {
      fontSize: '1.25rem',
    },
  },
  components: {
    MuiLink:{
      defaultProps:{
        underline: 'hover',
      },
      styleOverrides: {
        root:{
          color:"#751e1e",
        }
      }
    },
    MuiTable:{
      defaultProps: {
        // The props to change the default for.
        size: "small", // No more ripple, on the whole application 💣!
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#751e1e',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head:{
          color:'#fff'
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaders:{
          backgroundColor: '#751e1e',
        },
        columnHeader:{
          color:'#fff'
        },
        sortIcon:{
          color:'#fff',
          fontSize:'20px',
          '&:hover':{
            opacity:'1'
          }
        }
      }
    },
    MuiDivider:{
      styleOverrides:{
        root:{
          borderBottomWidth:'medium',
        }
      }
    },
    MuiCardHeader:{
      styleOverrides:{
        title:{
          textAlign:'center'
        }
      }
    },
  },
});

export const sxGroupStyles = {
  tableContainerSmallest:{
    width:{
      xs:'100%', 
      sm:'auto'
    }
  },
  boxWrapperChart:{
    width:'100%', 
    position:'relative', 
    height:'300px'
  },
  tabSwitchLeague:{
    fontSize:{xs:'0.8em', sm:'0.875em'},
    padding:{xs:'8px 12px', sm:'12px 16px'}
  }
}