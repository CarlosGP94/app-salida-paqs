import React from "react";

const MenuItem = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontWeight: 500,
      padding: theme.spacing(0.75, 1.25),
      fontSize: theme.typography.body2.fontSize,
      borderRadius: theme.shape.borderRadius * 1.5,
      transition: "all 0.3s ease-in-out",
      "&:hover": { backgroundColor: theme.palette.info.dark },
    }),
  },
};

export default MenuItem;
