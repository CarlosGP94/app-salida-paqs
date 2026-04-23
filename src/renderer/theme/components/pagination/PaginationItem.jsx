import React from "react";
const PaginationItem = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontSize: theme.typography.body2.fontSize,
      "&.Mui-selected": {
        color: theme.palette.info.lighter,
        backgroundColor: theme.palette.primary.main,
        "&:hover": { backgroundColor: theme.palette.primary.main },
      },
    }),
  },
};

export default PaginationItem;
