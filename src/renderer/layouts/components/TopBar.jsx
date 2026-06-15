import React from 'react';
import { ButtonBase, Stack, Typography, Button } from '@mui/material';
import Link from '@mui/material/Link';
import paths from '../../routes/paths';
import Image from '../../components/base/Image';
import LogoImg from '../../../assets/logos/logo.jpg';

export default function TopBar({ title = '' }) {
  const handleCerrarPrograma = () => {
    window.api.actions.cerrarPrograma();
  };
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        px: { xs: 2, sm: 4 }, // Padding responsivo
        py: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo sutilmente transparente
        backdropFilter: 'blur(8px)', // Efecto glassmorphism moderno
        borderBottom: '1px solid',
        borderColor: 'divider', // Línea sutil en lugar de una sombra pesada
      }}
    >
      {/* Contenedor del Logo */}
      <ButtonBase
        component={Link}
        href={paths.home}
        disableRipple
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Image
          src={LogoImg}
          alt="logo"
          sx={{
            width: { xs: 100, sm: 120 }, // Logo responsivo
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </ButtonBase>

      {/* Título de la página */}
      {title && (
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Tipografía fluida (no tan gigante de golpe)
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </Typography>
      )}

      {/* Acción Principal */}
      <Button
        variant="contained"
        color="error"
        size="small"
        sx={{
          borderRadius: '8px', // Bordes ligeramente más redondeados modernos
          textTransform: 'none', // Evita las mayúsculas automáticas forzadas
          fontWeight: 500,
        }}
        onClick={handleCerrarPrograma}
      >
        Cerrar Programa
      </Button>
    </Stack>
  );
}
