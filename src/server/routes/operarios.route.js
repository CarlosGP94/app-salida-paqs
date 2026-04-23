import { ipcMain } from "electron";
import operariosController from "../controllers/operarios.controller";

export default function operariosRoutes() {
  ipcMain.handle("operarios:getAll", operariosController.getOperarios);
}
