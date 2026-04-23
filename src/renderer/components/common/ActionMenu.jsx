import { useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import React from "react";
import { muiIcons } from "../../icons";

const ActionMenu = ({
  options = [],
  children,
  hideDetail = false,
  hideDelete = false,
  hideEdit = false,
  onDetail = () => {},
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleActionButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box pr={2}>
      <IconButton
        sx={{ borderRadius: "100%", height: 30, width: 30 }}
        onClick={handleActionButtonClick}
      >
        {children}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
        sx={{
          mt: 0.5,
          "& .MuiList-root": {},
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {options.length > 0 &&
          options.map((o, index) => {
            const IconComponent = muiIcons[o.icon];
            return (
              <MenuItem key={o?.id + index} onClick={o?.onHandle}>
                {IconComponent && (
                  <ListItemIcon sx={{ mr: 1, fontSize: "h5.fontSize" }}>
                    <IconComponent fontSize="inherit" />
                  </ListItemIcon>
                )}
                <ListItemText>
                  <Typography>{o?.label || ""}</Typography>
                </ListItemText>
              </MenuItem>
            );
          })}
        {!hideDetail && (
          <MenuItem onClick={onDetail}>
            <ListItemIcon sx={{ mr: 1, fontSize: "h5.fontSize" }}>
              <RemoveRedEye fontSize="inherit" />
            </ListItemIcon>
            <ListItemText>
              <Typography>Detalle</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {!hideEdit && (
          <MenuItem onClick={onEdit}>
            <ListItemIcon sx={{ mr: 1, fontSize: "h5.fontSize" }}>
              <Edit fontSize="inherit" />
            </ListItemIcon>
            <ListItemText>
              <Typography color={"text.primary"}>Editar</Typography>
            </ListItemText>
          </MenuItem>
        )}
        {!hideDelete && (
          <MenuItem onClick={onDelete}>
            <ListItemIcon sx={{ mr: 1, fontSize: "h5.fontSize" }}>
              <Delete fontSize="inherit" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color={"error"}>Eliminar</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ActionMenu;
