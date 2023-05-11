import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux'
import { store } from './redux/store'

import { defaultTheme } from './utils/theme'
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from "@mui/material/styles";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
