import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';

const MenuButton = ({
  color = 'primary',
  label = 'Opciones',
  options = [],
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box>
      <Button
        size="small"
        variant="contained"
        color={color}
        onClick={handleMenuOpen}
      >
        {label}
      </Button>
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              handleMenuClose();
              if (option.action) {
                option.action();
              }
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MenuButton;
