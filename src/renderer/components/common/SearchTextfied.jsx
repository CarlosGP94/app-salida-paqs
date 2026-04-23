import { Search, Close } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";

const SearchTextfield = ({
  searchTerm = "",
  handleChange = () => {},
  placeholder = "Buscar...",
  loading = false,
  disabled = false,
  debounceTime = 500,
}) => {
  const [value, setValue] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleChange(value);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [value, handleChange, debounceTime]);

  const clearInput = () => {
    setValue("");
    handleChange("");
  };

  return (
    <form noValidate autoComplete="off">
      <TextField
        value={value}
        disabled={disabled}
        size="small"
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        InputProps={{
          style: { width: 250, height: 35 },
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} />}
              {!loading && value !== "" && (
                <IconButton
                  size="small"
                  aria-label="clear input"
                  onClick={clearInput}
                  edge="end"
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
              {!loading && value === "" && (
                <IconButton
                  size="small"
                  aria-label="search"
                  onClick={() => {}}
                  edge="end"
                  color="primary"
                >
                  <Search fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};

export default SearchTextfield;
