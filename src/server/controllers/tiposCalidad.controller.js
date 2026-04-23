import { listarTodosTiposCalidadService } from "../services/tiposCalidad.service";

const tiposCalidadController = {
  async getAll(_) {
    try {
      const { data, total } = await listarTodosTiposCalidadService();
      return { success: true, data: data, total: total };
    } catch (error) {
      console.error("Error en tiposCalidadController.getAll:", error);
      return { success: false, error: error.message };
    }
  },
};

export default tiposCalidadController;
