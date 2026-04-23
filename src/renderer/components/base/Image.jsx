import { Box } from "@mui/material";
import React from "react";

const Image = ({ sx, ...rest }) => {
  return <Box component="img" sx={sx} {...rest} />;
};

export default Image;
