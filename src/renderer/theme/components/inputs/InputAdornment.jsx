import React from "react";
const InputAdornment = {
  styleOverrides: {
    root: ({ theme }) => ({
      margin: "0 !important",
      color: theme.palette.text.primary,
      fontSize: theme.typography.h5.fontSize,

      "&.MuiInputAdornment-sizeSmall": {
        "& .MuiBox-root": {
          fontSize: theme.typography.h6.fontSize,
        },
      },
    }),
    positionStart: ({ theme }) => ({
      paddingRight: theme.spacing(1),
    }),
    positionEnd: ({ theme }) => ({
      paddingRight: theme.spacing(0.25),
    }),
  },
};

export default InputAdornment;
