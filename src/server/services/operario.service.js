import database from '../../db/database';

export const listarTodosOperariosService = async () => {
  try {
    const conn = database.getConnection();
    const query = `
      SELECT id, nombre, apellido1, apellido2
      FROM Operarios
      ORDER BY nombre, apellido1, apellido2 ASC
    `;
    const rows = await conn.query(query);
    return { data: rows, total: rows.length };
  } catch (error) {
    console.error('Error listando operarios:', error.message);
    throw error;
  }
};
