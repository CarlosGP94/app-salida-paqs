import { ipcMain } from 'electron';
import tubosController from '../controllers/tubos.controller';

export default function tubosRoutes() {
  ipcMain.handle('tubos:getAllForSelects', tubosController.getAllForSelects);
  ipcMain.handle('tubos:getTubos', tubosController.getTubos);
}
