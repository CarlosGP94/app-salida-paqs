import React from 'react';

const DataGrid = {
  defaultProps: {
    disableColumnMenu: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      border: 'none',
      borderRadius: '0 !important',
      '--DataGrid-rowBorderColor': theme.palette.info.main,
      '&:hover, &:focus': {
        '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      },
      '& .MuiDataGrid-scrollbar--vertical': {
        visibility: 'hidden',
      },
      '& .MuiDataGrid-scrollbarFiller': {
        minWidth: 0,
      },
    }),
    row: {
      '&:hover': { backgroundColor: 'transparent' },
    },
    cell: ({ theme }) => ({
      paddingY: 0,
      color: theme.palette.primary.darker,
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 500,
      '&:focus-within': {
        outline: 'none !important',
      },
    }),
    cellCheckbox: ({ theme }) => ({
      paddingLeft: theme.spacing(1),
    }),
    columnHeaderCheckbox: ({ theme }) => ({
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        paddingLeft: theme.spacing(1),
      },
    }),
    columnHeader: {
      border: 0,
      paddingY: 0,
      height: '3rem !important',
      '&:focus-within': {
        outline: 'none !important',
      },
    },
    columnHeaderTitle: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontSize: theme.typography.body2.fontSize,
      fontWeight: `${theme.typography.caption.fontWeight} !important`,
    }),
    iconButtonContainer: () => ({
      '& .MuiIconButton-root': {
        backgroundColor: 'transparent !important',
        border: 'none',
      },
    }),

    footerContainer: () => ({
      border: 'none',
    }),
  },
};

export default DataGrid;
