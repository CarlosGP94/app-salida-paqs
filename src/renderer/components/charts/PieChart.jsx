import { Box, Stack } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import React from "react";

const data = [
  { label: "Group A", value: 400, color: "#0088FE" },
  { label: "Group B", value: 300, color: "#00C49F" },
  { label: "Group C", value: 300, color: "#FFBB28" },
  { label: "Group D", value: 200, color: "#FF8042" },
];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

export default function DonutChart() {
  return (
    <Stack direction="row" width="auto" textAlign="center" spacing={2}>
      <Box flexGrow={1}>
        <PieChart
          sx={{
            ".css-2fauxy-MuiChartsWrapper-root": {
              display: "none",
            },
          }}
          series={[
            { innerRadius: 50, outerRadius: 100, data, arcLabel: "value" },
          ]}
          {...settings}
        />
      </Box>
    </Stack>
  );
}
