const FilledInput = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius * 2,
    }),
    input: {
      padding: 0,
    },
    sizeSmall: ({ theme }) => ({
      paddingLeft: theme.spacing(1.25),
    }),
  },
};

export default FilledInput;
