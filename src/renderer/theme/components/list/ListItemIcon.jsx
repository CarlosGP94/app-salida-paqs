import React from "react";

const ListItemIcon = {
  styleOverrides: {
    root: ({ theme }) => ({
      minWidth: "0 !important",
      marginRight: theme.spacing(1.75),
      color: theme.palette.text.primary,
      fontSize: theme.typography.h5.fontSize,
    }),
  },
};

export default ListItemIcon;
