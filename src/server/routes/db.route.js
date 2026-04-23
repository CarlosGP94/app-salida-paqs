import { ipcMain } from 'electron';
import database from '../../db/database';

export default function dbRoutes() {
  ipcMain.handle('db:getStatus', () => {
    return database.status;
  });
  ipcMain.handle('db:connect', async () => {
    try {
      await database.connect();
      return { success: true, status: database.status };
    } catch (err) {
      return { success: false, status: database.status, error: err.message };
    }
  });
}
