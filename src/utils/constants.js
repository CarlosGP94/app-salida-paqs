// Configuración de bases de datos
export const DB_CONFIG = {
  remote: {
    server: '.\\SQLEXPRESS',
    database: 'prod_tubos',
    trusted: true,
    user: 'usuariodb',
    password: 'macero',
  },
};

// Puerto del servidor
export const SERVER_PORT = 3000;

// Tables
export const ROW_HEIGHT = 52;
export const PAGE_SIZE = 50;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Storage
export const storagePath =
  '\\\\DESKTOP-38CS798\\Users\\Wincc\\Documents\\Imagenes';
