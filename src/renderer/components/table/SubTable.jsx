import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import React from 'react'


export default function DataTable({ columns = [], rows = [] }) {
    return (
        <Paper sx={{ p: 0, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                rowCount={rows.length}
                disableColumnResize
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
                sx={{ border: 0 }}
            />
        </Paper>
    );
}