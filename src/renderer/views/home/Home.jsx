import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import SalidaTuboForm from './components/Form';
import Loading from '../Loading/Loading';
import { DataContext } from '../../contexts/DataContext';
import TubosTable from './components/TableTubos';

const Home = () => {
  const { loading } = useContext(DataContext);
  const [tab, setTab] = useState(0);

  const handleChange = (newValue) => {
    setTab(newValue);
  };

  const tabStyles = {
    fontWeight: 600,
    height: '20px',
  };

  return loading ? (
    <Loading />
  ) : (
    <Box
      sx={{
        height: 'calc(100vh - 120px)',
        p: 2,
      }}
    >
      <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
        <Stack alignItems={'center'} gap={1}>
          <Button
            size={'small'}
            onClick={() => {
              handleChange(0);
            }}
            variant={'contained'}
            color={tab == 0 ? 'primary' : 'secondary'}
          >
            Formulario
          </Button>
          <Button
            size={'small'}
            variant={'contained'}
            onClick={() => {
              handleChange(1);
            }}
            color={tab == 1 ? 'primary' : 'secondary'}
          >
            Inventario de Tubos
          </Button>
        </Stack>
      </Paper>
      {tab == 0 && <SalidaTuboForm />}
      {tab == 1 && <TubosTable />}
    </Box>
  );
};

export default Home;
