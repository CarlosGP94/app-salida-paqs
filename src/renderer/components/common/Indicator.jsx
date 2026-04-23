import React from "react";
import { Box, Tooltip, styled } from "@mui/material";

const IndicatorRoot = styled("span", {
  shouldForwardProp: (prop) => prop !== "status" && prop !== "size",
})(({ theme, status, size }) => ({
  display: "inline-block",
  width: size || 12,
  height: size || 12,
  borderRadius: "50%",
  backgroundColor:
    status === "active" ? theme.palette.success.main : theme.palette.error.main,
  border: `1px solid ${theme.palette.background.paper}`,
  boxShadow: `0 0 0 1px ${status === "active" ? theme.palette.success.main : theme.palette.error.main}`,
}));

export const StatusIndicator = ({ status = "active", label, size = 12 }) => {
  return (
    <Tooltip
      title={label || (status === "active" ? "Activo" : "Inactivo")}
      arrow
    >
      <IndicatorRoot
        status={status}
        size={size}
        role="img"
        aria-label={label || status}
      />
    </Tooltip>
  );
};
