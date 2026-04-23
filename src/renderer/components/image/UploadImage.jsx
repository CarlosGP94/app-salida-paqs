import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useState, useRef } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  flexCenter,
  flexColumnCenter,
  flexColumnEnd,
} from "../../utils/styles";
import { toast } from "react-toastify";

// initialImage: URL existente | onChange: función que recibe el archivo binario
const UploadImage = ({
  initialImage = null,
  loading = true,
  onChange = () => {},
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const currentImage = imagePreview || initialImage;

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Por favor, selecciona un formato válido (JPG o PNG).");
        event.target.value = "";
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error(
          "El archivo es demasiado pesado. El máximo permitido es 2MB."
        );
        event.target.value = "";
        return;
      }

      onChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.23)",
        borderRadius: "5px",
        p: 2,
        height: 350,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          ...flexColumnEnd,
          height: "100%",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            mb: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          {loading && (
            <Box sx={flexColumnCenter}>
              <CircularProgress />
              <Typography>Cargando...</Typography>
            </Box>
          )}
          {currentImage && !loading && (
            <img
              src={currentImage}
              alt="Preview"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          )}
          {!currentImage && !loading && (
            <Typography color="textSecondary">Sin logo seleccionado</Typography>
          )}
        </Box>

        <input
          type="file"
          accept="image/jpeg, image/png"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<UploadFileIcon />}
          onClick={handleButtonClick}
          disabled={loading}
        >
          {currentImage ? "Cambiar Logo" : "Insertar Logo"}
        </Button>
      </Box>
    </Box>
  );
};

export default UploadImage;
