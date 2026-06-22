import {
  actualizarTuboService,
  crearTuboService,
  eliminarTuboService,
  informeTubos,
  listarTiposTubosService,
  listarTodosTubosService,
  listarTubosService,
} from '../services/tubos.service';

const tubosController = {
  async getAllForSelects(_, payload) {
    try {
      const { data, total } = await listarTodosTubosService(payload);
      return { success: true, data: data, total: total };
    } catch (error) {
      console.error('Error en tubosController.getAll:', error);
      return { success: false, error: error.message };
    }
  },
  async getTubos(_, payload) {
    try {
      const { data, total } = await listarTubosService(payload);
      return { success: true, data: data, total: total };
    } catch (error) {
      console.error('Error en tubosController.getTubos:', error);
      return { success: false, error: error.message };
    }
  },
};

export default tubosController;
