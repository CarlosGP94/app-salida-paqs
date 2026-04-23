import React from "react";
import {
  Modal as MuiModal,
  Box,
  Typography,
  Fade,
  Button,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { flexEnd } from "../../utils/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "80%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Modal = ({
  maxWidth = "md",
  open = false,
  title = "",
  children,
  showCancel = false,
  showCustom = false,
  customText = "Aceptar",
  cancelText = "Cancelar",
  handleClose = () => {},
  handleCustom = () => {},
  handleCancel = () => {},
}) => {
  return (
    <MuiModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={{ ...style, maxWidth: maxWidth }}>
          {title && (
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
          )}
          <Box id="transition-modal-description" sx={{ mt: 2 }}>
            {children}
          </Box>
          {(showCancel || showCustom) && (
            <Box sx={{ ...flexEnd, mt: 2 }}>
              {showCustom && (
                <Button size="small" variant="contained" onClick={handleCustom}>
                  {customText}
                </Button>
              )}
              {showCancel && (
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={handleCancel}
                >
                  {cancelText}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </MuiModal>
  );
};

export default Modal;
