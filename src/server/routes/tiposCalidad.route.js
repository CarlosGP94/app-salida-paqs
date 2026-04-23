import { ipcMain } from "electron";
import tiposCalidadController from "../controllers/tiposCalidad.controller";

export default function tiposCalidadRoutes() {
  ipcMain.handle("tiposCalidad:getAll", tiposCalidadController.getAll);
}
