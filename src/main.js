const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { default: database } = require('./db/database');
const { default: dbRoutes } = require('./server/routes/db.route');
const { default: operariosRoutes } = require('./server/routes/operarios.route');
const {
  default: tiposCalidadRoutes,
} = require('./server/routes/tiposCalidad.route');
const { default: tubosRoutes } = require('./server/routes/tubos.route');
const {
  default: salidasPaqRoutes,
} = require('./server/routes/salidasPaq.route');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // Abrir la app
  createWindow();
  // Conectar a la base de datos
  try {
    console.log('🔌 Iniciando conexión a SQL Server...');
    await database.connect();
    console.log('✔ BD lista.');
  } catch (err) {
    console.error('❌ Error al conectar con la BD:', err);
  }

  // Iniciar rutas del servidor
  dbRoutes();
  operariosRoutes();
  tiposCalidadRoutes();
  tubosRoutes();
  salidasPaqRoutes();
  ipcMain.handle('cerrar-app', async () => {
    try {
      const connection = database.getConnection();

      if (connection?.close) {
        await connection.close();
      } else if (connection?.disconnect) {
        await connection.disconnect();
      }
    } catch (err) {
      console.error('❌ Error al cerrar la BD:', err);
    }

    app.exit(0);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
