import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  MenuItem,
  Select as SelectMUI,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Box,
} from "@mui/material";

const Select = ({
  name,
  size = "medium",
  label,
  options = [],
  loading = false,
  disabled = false,
  onChange = null,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl size={size} fullWidth error={!!errors[name]}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SelectMUI
            {...field}
            labelId={`${name}-label`}
            label={label}
            disabled={disabled}
            onChange={(e) => {
              if (onChange) {
                onChange(e.target.value);
              } else {
                field.onChange(e.target.value);
              }
            }}
            value={field.value || ""}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {loading ? (
              <MenuItem value="" disabled>
                <Box display="flex" alignItems="center">
                  <CircularProgress size={20} style={{ marginRight: 8 }} />
                  Cargando...
                </Box>
              </MenuItem>
            ) : options.length === 0 ? (
              <MenuItem value="" disabled>
                No hay opciones disponibles
              </MenuItem>
            ) : (
              options.map((o, index) => (
                <MenuItem
                  value={o?.value || ""}
                  key={`${name}-${o?.value}-${index}`}
                >
                  {o?.label || ""}
                </MenuItem>
              ))
            )}
          </SelectMUI>
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
