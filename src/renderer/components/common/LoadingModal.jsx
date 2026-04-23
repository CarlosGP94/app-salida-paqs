import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Modal from "./Modal";
import { flexColumnCenter } from "../../utils/styles";

const LoadingModal = ({ open }) => {
  return (
    <Modal open={open}>
      <Box sx={flexColumnCenter}>
        <CircularProgress size={60} />
        <Typography>Cargando...</Typography>
      </Box>
    </Modal>
  );
};

export default LoadingModal;
