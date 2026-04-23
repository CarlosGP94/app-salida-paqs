import React from "react";

const ButtonBase = {
  defaultProps: {
    disableRipple: false,
  },
  styleOverrides: {
    root: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  },
};

export default ButtonBase;
