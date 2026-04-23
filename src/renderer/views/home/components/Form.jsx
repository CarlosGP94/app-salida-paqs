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
  IconButton,
} from '@mui/material';
import {
  Person,
  FilterList,
  Save,
  Close,
  Inventory,
  Delete,
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
  const [listadoSalidas, setListadoSalidas] = useState([]); // El "subformulario" de Access

  const methods = useForm({
    resolver: zodResolver(salidaSchema),
    defaultValues: {
      operario_id: data?.operario_id || '',
      calidad_id: data?.calidad_id || '',
      tubo_id: data?.tubo_id || '',
      num_paqs: 1,
      fecha: data?.fecha || new Date().toISOString().split('T')[0],
      observacion: data?.observacion || '',
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const watchCalidadId = watch('calidad_id');
  const watchTuboId = watch('tubo_id');

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

  useEffect(() => {
    if (watchCalidadId) {
      loadTubos(watchCalidadId);
    }
  }, [watchCalidadId]);

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
                      <TableCell
                        align="right"
                        sx={{ bgcolor: '#eee', fontWeight: 'bold' }}
                      >
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listadoSalidas.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.medida}</TableCell>
                        <TableCell align="center">{item.num_paqs}</TableCell>
                        <TableCell>{item.nombre_operario}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {}}
                          >
                            <Delete fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {listadoSalidas.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
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
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
};

export default SalidaTuboForm;
