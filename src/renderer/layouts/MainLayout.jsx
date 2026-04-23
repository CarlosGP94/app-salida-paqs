import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { Outlet } from 'react-router-dom';
import React from 'react';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  return (
    <Box minHeight="100vh">
      <TopBar />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
