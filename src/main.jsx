import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TestModeContextProvider } from './Context/TestModeContext';
import { ThemeContextProvider } from './Context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import { AlertContextProvider } from './Context/AlertContext';

ReactDOM.render(
  <>
    <AlertContextProvider>
      <ThemeContextProvider>
        <TestModeContextProvider>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </TestModeContextProvider>
      </ThemeContextProvider>
    </AlertContextProvider>
    
  </>,
  document.getElementById('root')
);

