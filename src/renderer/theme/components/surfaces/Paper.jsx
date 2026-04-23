import customShadows from "../../shadows";
import React from "react";

const Paper = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3.5),
      backgroundColor: theme.palette.info.light,
      borderRadius: theme.shape.borderRadius * 3,
      boxShadow: "none",

      "&.MuiMenu-paper": {
        padding: 0,
        boxShadow: customShadows[1],
      },
    }),
  },
};

export default Paper;
