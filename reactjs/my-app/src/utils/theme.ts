import { BoltRounded } from '@mui/icons-material';
import { createTheme } from '@mui/material';
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
      fontSize: '4rem',
      fontWeight: 300,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '3.5rem',
      lineHeight: 1.1,
    },
    h3: {
      lineHeight: 0.9,
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
    }
  },
});