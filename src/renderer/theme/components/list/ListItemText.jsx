import React from "react";

const ListItemText = {
  styleOverrides: {
    root: {},
    primary: ({ theme }) => ({
      marginTop: theme.spacing(0.15),
      color: theme.palette.text.primary,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: 600,
    }),
  },
};

export default ListItemText;
