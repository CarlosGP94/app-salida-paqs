import { ipcMain } from 'electron';
import salidasPaqController from '../controllers/salidasPaq.controller';

export default function salidasPaqRoutes() {
  ipcMain.handle('salidasPaq:getAll', salidasPaqController.getAll);
  ipcMain.handle('salidasPaq:create', salidasPaqController.create);
}
