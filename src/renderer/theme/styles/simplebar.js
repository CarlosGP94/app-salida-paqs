const simplebar = (theme) => ({
  "& .simplebar-track": {
    "&.simplebar-vertical": {
      "& .simplebar-scrollbar": {
        "&:before": {
          backgroundColor: theme.palette.grey[300],
        },
        "&.simplebar-visible": {
          "&:before": {
            opacity: 1,
          },
        },
      },
    },
  },
});

export default simplebar;
