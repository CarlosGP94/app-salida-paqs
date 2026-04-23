import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField as TextFieldMUI } from "@mui/material";

const TextField = ({
  fullWidth = true,
  name,
  label,
  size = "medium",
  disabled = false,
  type = "text",
  multiline = false,
  rows = 3,
  onChange = null,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextFieldMUI
          {...field}
          fullWidth={fullWidth}
          label={label}
          size={size}
          type={type}
          InputProps={{
            style: {
              height:
                size === "small" ? (multiline ? rows * 24 : 40) : undefined,
            },
          }}
          disabled={disabled}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          error={!!errors[name]}
          helperText={errors[name]?.message || ""}
          onChange={(e) => {
            let nextValue;
            if (type === "number") {
              const value = e.target.value;
              nextValue = value === "" ? 0 : Number(value);
              field.onChange(nextValue);
            } else {
              nextValue = e.target.value;
              field.onChange(nextValue);
            }

            if (onChange) {
              onChange(nextValue);
            }
          }}
          value={field.value || ""}
        />
      )}
    />
  );
};

export default TextField;
