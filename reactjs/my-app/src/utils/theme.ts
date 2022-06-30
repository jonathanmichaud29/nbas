import { createTheme } from '@mui/material';
 
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
});