import IconifyIcon from '../../../components/base/IconifyIcon';
import React from 'react';

const Checkbox = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.info.dark,
    }),
    sizeMedium: ({ theme }) => ({
      padding: theme.spacing(0.75),
      '& .MuiBox-root': {
        fontSize: theme.typography.h5.fontSize,
      },
    }),
    sizeSmall: ({ theme }) => ({
      '& .MuiBox-root': {
        fontSize: theme.typography.h6.fontSize,
      },
    }),
  },
};

export default Checkbox;
