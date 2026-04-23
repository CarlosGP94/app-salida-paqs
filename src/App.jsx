import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './renderer/theme/theme';
import { Bounce, ToastContainer } from 'react-toastify';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import paths from './renderer/routes/paths';
import React from 'react';
import Home from './renderer/views/home/Home';
import { DataProvider } from './renderer/contexts/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ThemeProvider theme={theme}>
      <DataProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <Routes>
          <Route path={paths.home} element={<Home />} />
        </Routes>
      </DataProvider>
    </ThemeProvider>
  </Router>,
);
