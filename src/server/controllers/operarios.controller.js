import { listarTodosOperariosService } from "../services/operario.service";

const operariosController = {
  getOperarios: async (_, payload) => {
    try {
      const operarios = await listarTodosOperariosService();
      return { success: true, data: operarios.data, total: operarios.total };
    } catch (error) {
      console.error("Error en operaiosController.getOperarios:", error);
      return { success: false, error: error.message };
    }
  },
};

export default operariosController;
