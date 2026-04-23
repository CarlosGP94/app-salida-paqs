import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ButtonBase, Stack } from '@mui/material';
import Link from '@mui/material/Link';
import paths from '../../routes/paths';
import Image from '../../components/base/Image';
import LogoImg from '../../../assets/logos/logo.jpg';

export default function TopBar() {
  return (
    <Stack
      sx={{
        boxShadow: '0 8px 12px -12px rgba(0, 0, 0, 0.38)',
        px: 2,
        py: 1,
        backgroundColor: 'white',
      }}
    >
      <ButtonBase component={Link} href={paths.home} disableRipple>
        <Image
          src={LogoImg}
          alt="logo"
          width={140}
          sx={{
            height: 'auto',
          }}
        />
      </ButtonBase>
    </Stack>
  );
}
