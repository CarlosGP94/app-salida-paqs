import React from "react";

const Select = {
  styleOverrides: {
    root: {
      padding: 0,
      "&.MuiInputBase-root": {
        backgroundColor: "transparent !important",
        border: "none",
      },
    },
    select: ({ theme }) => ({
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(1.25),
      paddingRight: "0 !important",
      backgroundColor: "transparent !important",
    }),
    icon: ({ theme }) => ({
      color: theme.palette.text.disabled,
      fontSize: theme.typography.h4.fontSize,
    }),
  },
};

export default Select;
