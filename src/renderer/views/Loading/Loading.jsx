import React from 'react';
import { CircularProgress, Stack, Typography, Box } from '@mui/material';

const Loading = ({ message = 'Cargando datos...' }) => {
  return (
    <Stack
      sx={{
        height: '100%',
        minHeight: '200px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        spacing: 2,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: 'primary.main' }}
        />
      </Box>
      <Typography
        variant="h2"
        sx={{
          mt: 2,
          color: 'text.secondary',
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        {message}
      </Typography>
    </Stack>
  );
};

export default Loading;
