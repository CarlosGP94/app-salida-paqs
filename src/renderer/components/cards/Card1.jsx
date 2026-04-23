import { Card, Typography } from "@mui/material";
import React from "react";

const Card1 = ({ title = "", list = [] }) => {
  return (
    <Card sx={{ p: 1 }}>
      {title && <Typography variant={"h5"}></Typography>}
      {list && list.length > 0 && <Box sx={{ mt: title ? 1 : 0 }}></Box>}
    </Card>
  );
};

export default Card1;
