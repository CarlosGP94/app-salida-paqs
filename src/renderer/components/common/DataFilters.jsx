import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { flexEnd, flexSpaceBetween } from "../../utils/styles";
import SearchTextfield from "./SearchTextfied";
import React from "react";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

const DataFilters = ({
  sx = {},
  searchTerm = "",
  hiddenSearch = false,
  filters = [],
  loading = false,
  handleFilterChange = () => {},
  handleCleanFilters = () => {},
}) => {
  return (
    <Card sx={{ py: 1.5, px: 1, ...flexSpaceBetween, ...sx }}>
      <Box>
        {!hiddenSearch && (
          <SearchTextfield
            placeholder="Buscar..."
            loading={loading}
            searchTerm={searchTerm}
            handleChange={(value) => {
              handleFilterChange("search", value);
            }}
          />
        )}
      </Box>
      <Box sx={flexEnd}>
        {filters.map(
          (filter, index) =>
            filter.type !== "search" && (
              <Box key={filter.name + index}>
                {filter.type === "select" && (
                  <FormControl
                    sx={{ minWidth: filter?.minWidth ? filter?.minWidth : 120 }}
                    disabled={loading}
                  >
                    <InputLabel size="small" id={`${filter.name}-label`}>
                      {filter.label}
                    </InputLabel>
                    <Select
                      labelId={`${filter.name}-label`}
                      id={`${filter.name}-select`}
                      name={filter?.name || ""}
                      value={filter?.value || ""}
                      label={filter?.label || ""}
                      onChange={(e) => {
                        handleFilterChange(filter.name, e.target.value);
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Ninguno</em>
                      </MenuItem>
                      {(filter?.options || []).map((option, index) => (
                        <MenuItem
                          value={option.value}
                          key={option.value + option.label + index}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            )
        )}
        {filters.length > 0 && (
          <Button
            variant="contained"
            size="small"
            color={"primary"}
            startIcon={<FilterAltOffIcon />}
            onClick={handleCleanFilters}
          >
            Limpiar filtros
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default DataFilters;
