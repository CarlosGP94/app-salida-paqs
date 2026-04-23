import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';
import SalidaTuboForm from './components/Form';
import Loading from '../Loading/Loading';
import { DataContext } from '../../contexts/DataContext';

const Home = () => {
  const { operarios, tiposCalidad, loading } = useContext(DataContext);
  return loading ? <Loading /> : <SalidaTuboForm />;
};

export default Home;
