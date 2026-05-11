import database from '../../db/database';

export async function listarTodosTiposCalidadService() {
  try {
    const conn = database.getConnection();

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM Tipos_calidad
  `;
    const countResult = await conn.query(countQuery);
    const total = countResult[0]?.total || 0;

    const selectQuery = `
    WITH TiposCalidadCTE AS (
      SELECT *,
             ROW_NUMBER() OVER (ORDER BY creado) AS rn
      FROM Tipos_calidad
    )
    SELECT *
    FROM TiposCalidadCTE
    ORDER BY nombre ASC
  `;

    const rows = await conn.query(selectQuery);
    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        nombre: row.nombre,
        creado: row.creado,
      })),
      total,
    };
  } catch (error) {
    console.error('Error listando tipos de calidad:', error.message);
    throw error;
  }
}
