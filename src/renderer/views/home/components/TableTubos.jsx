import { Stack, Typography, Box, Paper, Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Inventory2, ViewList } from '@mui/icons-material';
import ActionMenu from '../../../components/common/ActionMenu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { PAGE_SIZE, ROW_HEIGHT } from '../../../../utils/constants';
import DataFilters from '../../../components/common/DataFilters';
import { DataGrid } from '@mui/x-data-grid';
import DataGridFooter from '../../../components/common/DataGridFooter';
import { initFilters } from './utils';
import { DataContext } from '../../../contexts/DataContext';
import { resolveSortParams } from '../../../utils/functions';
import RefreshIcon from '@mui/icons-material/Refresh';

const sortFieldMap = {
  Calidad: 'calidad',
  Unidades: 'unidades',
};

const TubosTable = () => {
  //Filters
  const { tiposCalidad } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFiltered] = useState(initFilters);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [initializedFilters, setInitializedFilters] = useState(false);
  //Pagination
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [tubos, setTubos] = useState([]);
  const [total, setTotal] = useState([]);
  // Sort
  const [sortModel, setSortModel] = useState([]);

  const loadTubos = async (
    page = 1,
    pageSize = PAGE_SIZE,
    searchTerm = '',
    filters,
    sortModel,
  ) => {
    try {
      setLoading(true);
      const { orderBy, orderDir } = resolveSortParams(sortModel, sortFieldMap);
      const result = await window.api.tubos.getTubos({
        page,
        pageSize,
        searchTerm,
        calidad_id: filters.find((f) => f.name === 'calidad')?.value || 0,
        activo: 1,
        orderBy,
        orderDir: orderBy ? orderDir : 'ASC',
      });
      console.log('result', result);
      setTubos(result?.data || []);
      setTotal(result?.total || 0);
      setLoading(false);
    } catch (e) {
      console.log(e?.message || e);
    }
  };

  const fetchFilters = async () => {
    return {
      calidad:
        tiposCalidad?.map((calidad) => ({
          value: calidad.id,
          label: calidad.nombre,
        })) || [],
    };
  };

  const handleFilterChange = async (filterName, value, type = 'select') => {
    if (filterName === 'search') {
      setSearchTerm(value);
      return;
    }

    let newFilters = filters.map((filter) => {
      if (filter.name === filterName) {
        return type === 'daterange'
          ? { ...filter, valueStart: value.start, valueEnd: value.end }
          : { ...filter, value };
      }
      return filter;
    });

    const filtersData = await fetchFilters(filters);
    newFilters = newFilters.map((filter) => {
      return {
        ...filter,
        options: (filtersData[filter.name] || []).map((option) => ({
          label: option?.label ? option?.label : option,
          value: option?.value ? option?.value : option,
        })),
      };
    });

    setFiltered(newFilters);
    setSortModel([]);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    const resetFilters = filters.map((filter) => ({
      ...filter,
      value: null,
      valueStart: null,
      valueEnd: null,
    }));
    setFiltered(resetFilters);
  };

  const setInitFilters = async () => {
    setLoadingFilters(true);
    const filtersData = await fetchFilters(filters);
    const initializedFilters = initFilters.map((filter) => {
      return {
        ...filter,
        options: (filtersData[filter.name] || []).map((option) => ({
          label: option?.label ? option?.label : option,
          value: option?.value ? option?.value : option,
        })),
      };
    });
    setFiltered(initializedFilters);
    setLoadingFilters(false);
    setInitializedFilters(true);
  };

  const handleSortModel = (model) => {
    setSortModel(model);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    loadTubos(page, PAGE_SIZE, searchTerm, filters, sortModel);
  }, [page, filters, searchTerm, sortModel]);

  useEffect(() => {
    setInitFilters();
  }, []);

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent={'space-between'}
      >
        <Stack sx={{ my: 1 }} direction="row" spacing={1} alignItems="center">
          <ViewList color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Inventario de tubos
          </Typography>
        </Stack>
        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          onClick={() => {
            loadTubos(page, PAGE_SIZE, searchTerm, filters, sortModel);
          }}
          color={'primary'}
          size={'small'}
        >
          Recargar
        </Button>
      </Stack>
      <DataFilters
        sx={{ mb: 1 }}
        loading={loading || loadingFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleCleanFilters={handleClearAllFilters}
      />
      <Paper variant="outlined">
        <DataGrid
          sx={{ maxHeight: 'calc(100vh - 360px)', width: '100%' }}
          density="standard"
          loading={loading}
          rowCount={total}
          paginationMode="server"
          columns={getColumns((row) => {
            setSelected(row);
            setOpenLotes(true);
          })}
          rows={tubos}
          rowHeight={ROW_HEIGHT}
          disableColumnResize
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          sortModel={sortModel}
          onSortModelChange={(model) => {
            console.log(model);
            handleSortModel(model);
          }}
          paginationModel={{
            page: page - 1,
            pageSize: PAGE_SIZE,
          }}
          autosizeOptions={{
            includeOutliers: true,
            includeHeaders: false,
            outliersFactor: 1,
            expand: true,
          }}
          slots={{
            pagination: DataGridFooter,
          }}
          onPaginationModelChange={(model) => {
            handlePageChange(model.page + 1);
          }}
          localeText={{
            noRowsLabel: 'No hay elementos',
          }}
          checkboxSelection={false}
          pageSizeOptions={[]}
        />
      </Paper>
    </Box>
  );
};

export default TubosTable;

const getColumns = (handleDetail = () => {}) => [
  {
    field: 'id',
    headerName: 'ID',
    editable: false,
    align: 'left',
    width: 5,
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.id || '-'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'art_concepto',
    headerName: 'Concepto',
    editable: false,
    align: 'left',
    flex: 1,
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.art_concepto || '-'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'calidad_nombre',
    headerName: 'Calidad',
    editable: false,
    align: 'left',
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.calidad_nombre || '-'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'tipo_nombre',
    headerName: 'Tipo',
    editable: false,
    align: 'left',
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.tipo_nombre || '-'}
        </Typography>
      </Stack>
    ),
  },

  {
    field: 'unidades',
    headerName: 'Unidades',
    headerAlign: 'center',
    editable: false,
    align: 'center',
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.unidades || '0'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'num_por_paq',
    headerName: 'Cant. Por Paquete',
    headerAlign: 'center',
    editable: false,
    align: 'center',
    width: 160,
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.num_por_paq || '0'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'num_paquetes',
    headerName: 'Cant. De Paquetes',
    headerAlign: 'center',
    editable: false,
    align: 'center',
    width: 160,
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.num_paquetes
            ? params?.row?.num_paquetes.toFixed(2)
            : '0'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'peso_unitario',
    headerName: 'Peso Unitario (kg)',
    headerAlign: 'center',
    editable: false,
    width: 160,
    align: 'center',
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.peso_unitario
            ? params?.row?.peso_unitario.toFixed(2)
            : '0'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'peso_total',
    headerName: 'Peso Total (kg)',
    headerAlign: 'center',
    editable: false,
    width: 160,
    align: 'center',
    renderCell: (params) => (
      <Stack
        height={1}
        direction="column"
        alignSelf="center"
        justifyContent="center"
      >
        <Typography variant="body2" fontWeight={500}>
          {params?.row?.peso_total ? params?.row?.peso_total.toFixed(2) : '0'}
        </Typography>
      </Stack>
    ),
  },
];
