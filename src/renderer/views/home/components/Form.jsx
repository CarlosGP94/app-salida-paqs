import React, { useContext, useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Stack,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material';
import {
  Person,
  FilterList,
  Save,
  Close,
  Inventory,
} from '@mui/icons-material';
import TextField from '../../../components/common/Textfield';
import Select from '../../../components/common/Select';
import { DataContext } from '../../../contexts/DataContext';
import { toast } from 'react-toastify';
import { z } from 'zod';

const salidaSchema = z.object({
  id: z.number().optional(),
  operario_id: z
    .number({ required_error: 'Seleccione un operario' })
    .positive('Requerido'),
  calidad_id: z
    .number({ required_error: 'Seleccione la calidad' })
    .positive('Requerido'),
  tubo_id: z
    .number({ required_error: 'Seleccione el tubo' })
    .positive('Requerido'),
  num_paqs: z.coerce
    .number()
    .int('Debe ser un número entero')
    .refine((val) => val !== 0, 'La cantidad no puede ser cero'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
});

const SalidaTuboForm = ({ data, handleConfirm, handleCancel }) => {
  const [tubos, setTubos] = useState([]);
  const [loadingTubos, setLoadingTubos] = useState(false);
  const { operarios, tiposCalidad } = useContext(DataContext);
  const [listadoSalidas, setListadoSalidas] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalSalidas, setTotalSalidas] = useState(0);

  const methods = useForm({
    resolver: zodResolver(salidaSchema),
    defaultValues: {
      operario_id: 0,
      calidad_id: 0,
      tubo_id: 0,
      num_paqs: 1,
      fecha: new Date().toISOString().split('T')[0],
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const watchCalidadId = watch('calidad_id');
  const watchTuboId = watch('tubo_id');
  const watchFecha = watch('fecha');

  const loadTubos = async (calidadId) => {
    if (!calidadId) return;
    try {
      setLoadingTubos(true);
      const result = await window.api.tubos.getAllForSelects({
        calidad_id: calidadId,
      });
      setTubos(result?.data || []);
    } catch (err) {
      toast.error('Error al cargar tubos');
    } finally {
      setLoadingTubos(false);
    }
  };

  const loadSalidasByFecha = async (
    fecha,
    requestedPage = page,
    requestedPageSize = pageSize,
  ) => {
    if (!fecha) return;
    try {
      const result = await window.api.salidasPaq.getAll({
        page: requestedPage + 1,
        pageSize: requestedPageSize,
        fecha,
      });

      if (!result?.success) {
        throw new Error(result?.error || 'No se pudieron cargar las salidas');
      }

      const rows = (result?.data || []).map((row, index) => ({
        ...row,
        id: row.id || `${row.fecha}-${row.tubo_id}-${index}`,
        medida: row.medida || `Tubo ID ${row.tubo_id}`,
        num_paqs: row.num_paqs ?? row.total_num_paqs ?? 0,
        nombre_operario: row.nombre_operario || '-',
      }));

      setListadoSalidas(rows);
      setTotalSalidas(Number(result?.total) || 0);
    } catch (err) {
      toast.error('Error al cargar salidas por fecha');
      setListadoSalidas([]);
      setTotalSalidas(0);
    }
  };

  useEffect(() => {
    if (watchCalidadId) {
      loadTubos(watchCalidadId);
    }
  }, [watchCalidadId]);

  useEffect(() => {
    if (!watchFecha) return;

    if (page !== 0) {
      setPage(0);
      return;
    }

    loadSalidasByFecha(watchFecha, page, pageSize);
  }, [watchFecha, page, pageSize]);

  const onSubmit = async (formData) => {
    try {
      const tuboSeleccionado = tubos.find((t) => t.id === formData.tubo_id);

      const payload = {
        ...formData,
        medida: tuboSeleccionado?.medida, // Para emular la búsqueda por medida de Access
        // Añadimos una bandera para que el backend sepa que debe procesar stock
        actualizarStock: true,
      };

      await handleConfirm(payload);

      setValue('tubo_id', '');
      setValue('num_paqs', 1);
      await loadSalidasByFecha(formData.fecha, page, pageSize);
      toast.success('Operación registrada correctamente');
    } catch (error) {
      toast.error('Error al procesar la salida');
    }
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Person color="primary" />
                <Typography variant="h6">Control de Salida</Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Select
                    size="small"
                    name="operario_id"
                    label="Operario Responsable"
                    options={
                      operarios?.map((o) => ({
                        value: o.id,
                        label: o.nombre_completo,
                      })) || []
                    }
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    size="small"
                    name="fecha"
                    type="date"
                    label="Fecha de Salida"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Inventory color="primary" />
                <Typography variant="h6">Detalles del Material</Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Select
                    size="small"
                    name="calidad_id"
                    label="1. Tipo de Calidad"
                    options={
                      tiposCalidad?.map((c) => ({
                        value: c.id,
                        label: c.nombre,
                      })) || []
                    }
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Select
                    size="small"
                    name="tubo_id"
                    label={'2. Seleccionar Tubo'}
                    disabled={!watchCalidadId}
                    loading={loadingTubos}
                    options={tubos.map((t) => ({
                      value: t.id,
                      label: t.medida || `ID: ${t.id}`,
                    }))}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    size="small"
                    name="num_paqs"
                    label="Nº Paquetes (Usar - para devolver)"
                    type="number"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack sx={{ justifyContent: 'flex-end' }} direction="row">
              <Button
                sx={{ maxWidth: 200 }}
                size="small"
                fullWidth
                variant="contained"
                type="submit"
                startIcon={<Save />}
              >
                Guardar Salida
              </Button>
            </Stack>
          </Grid>

          {/* --- PARTE INFERIOR: LISTADO (El subformulario tubos_por_salidas1) --- */}
          <Grid size={{ xs: 12 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <TableContainer
                variant="outlined"
                sx={{ height: 350, width: '99%' }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Inventory color="primary" />
                  <Typography variant="h6">
                    Detalle de Salidas del Día
                  </Typography>
                </Stack>

                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: '#eee', fontWeight: 'bold' }}>
                        Medida / Tubo
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ bgcolor: '#eee', fontWeight: 'bold' }}
                      >
                        Paquetes
                      </TableCell>
                      <TableCell sx={{ bgcolor: '#eee', fontWeight: 'bold' }}>
                        Operario
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listadoSalidas.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.medida}</TableCell>
                        <TableCell align="center">{item.num_paqs}</TableCell>
                        <TableCell>{item.nombre_operario}</TableCell>
                      </TableRow>
                    ))}
                    {listadoSalidas.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="center"
                          sx={{ py: 3, color: 'gray' }}
                        >
                          No hay tubos registrados para esta fecha
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalSalidas}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(event) => {
                  setPageSize(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20, 50]}
                labelRowsPerPage="Filas por página"
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
};

export default SalidaTuboForm;
