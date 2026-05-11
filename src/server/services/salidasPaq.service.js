import database from '../../db/database';

const formatFechaSoloDia = (fecha) => {
  if (!fecha) return null;

  if (typeof fecha === 'string') {
    return fecha.slice(0, 10);
  }

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return null;

  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

export const listarSalidasPaq = async ({ page = 1, pageSize = 10, fecha }) => {
  try {
    const conn = database.getConnection();
    const safePage = Math.max(Number(page) || 1, 1);
    const safePageSize = Math.max(Number(pageSize) || 10, 1);
    const offset = (safePage - 1) * safePageSize;

    const fechaNormalizada = fecha
      ? String(fecha).slice(0, 10).replace(/'/g, "''")
      : null;
    const whereFecha = fechaNormalizada
      ? `WHERE CAST(sp.creado AS date) = '${fechaNormalizada}'`
      : '';

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT CAST(sp.creado AS date) AS fecha, sp.tubo_id
        FROM Salidas_Paqs_Tubos AS sp
        ${whereFecha}
        GROUP BY CAST(sp.creado AS date), sp.tubo_id
      ) AS grupos
    `;

    const countResult = await conn.query(countQuery);
    const total = countResult[0].total;

    const query = `
      SELECT
        MIN(sp.id) AS id,
        CAST(sp.creado AS date) AS fecha,
        sp.tubo_id,
        MAX(t.medida) AS medida,
        MAX(LTRIM(RTRIM(CONCAT(o.nombre, ' ', o.apellido1, ' ', o.apellido2)))) AS nombre_operario,
        SUM(sp.num_paqs) AS total_num_paqs,
        COUNT(*) AS total_registros,
        MAX(sp.creado) AS creado
      FROM Salidas_Paqs_Tubos AS sp
      LEFT JOIN Tubos AS t ON t.id = sp.tubo_id
      LEFT JOIN Operarios AS o ON o.id = sp.operario_id
      ${whereFecha}
      GROUP BY CAST(sp.creado AS date), sp.tubo_id
      ORDER BY fecha ASC, sp.tubo_id ASC
      OFFSET ${offset} ROWS FETCH NEXT ${safePageSize} ROWS ONLY
    `;

    const rows = await conn.query(query);
    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        fecha: formatFechaSoloDia(row.fecha),
        tubo_id: Number(row.tubo_id),
        medida: row.medida,
        nombre_operario: row.nombre_operario,
        total_num_paqs: Number(row.total_num_paqs),
        total_registros: Number(row.total_registros),
        creado: formatFechaSoloDia(row.creado),
      })),
      total,
    };
  } catch (error) {
    console.error('Error al listar salidas_paq:', error);
    throw error;
  }
};

export const crearSalidaPaquetes = async ({
  operario_id,
  tubo_id,
  num_paqs,
  fecha,
}) => {
  let transactionStarted = false;
  try {
    const conn = database.getConnection();

    const cantidadSalida = Number(num_paqs);
    if (!Number.isFinite(cantidadSalida) || cantidadSalida === 0) {
      throw new Error('La cantidad de paquetes debe ser distinta de cero.');
    }

    const tuboQuery = `
      SELECT id, num_paquetes, num_por_paq, peso_unitario
      FROM Tubos WITH (UPDLOCK, ROWLOCK)
      WHERE id = ?
    `;

    const tubos = await conn.query(tuboQuery, [tubo_id]);
    if (!tubos?.length) {
      throw new Error('No se encontró el tubo a actualizar.');
    }

    const tubo = tubos[0];
    const stockActual = Number(tubo.num_paquetes) || 0;
    const numPorPaq = Number(tubo.num_por_paq) || 0;
    const nuevoStock = stockActual - cantidadSalida;
    const pesoUnit = Number(tubo.peso_unitario) || 0;

    const nuevasUnidades = nuevoStock * numPorPaq;
    const pesoTotalActual = nuevasUnidades * pesoUnit;
    const updateQuery = `
      UPDATE Tubos
      SET num_paquetes = ?,
          unidades = ?,
          peso_total = ?
      WHERE id = ?
    `;

    // Normalizar fecha a formato YYYY-MM-DD para SQL Server
    const fechaFormateada = formatFechaSoloDia(fecha);
    console.log('Fechas en crearSalidaPaquetes:', {
      fechaOriginal: fecha,
      fechaFormateada,
    });

    await conn.query(updateQuery, [
      nuevoStock,
      nuevasUnidades,
      pesoTotalActual,
      tubo_id,
    ]);

    const insertQuery = `
      INSERT INTO Salidas_Paqs_Tubos (operario_id, tubo_id, num_paqs, creado)
      VALUES (${operario_id}, ${tubo_id}, ${num_paqs}, '${fechaFormateada}')
    `;

    const result = await conn.query(insertQuery);

    return {
      id: result.insertId,
      tubo_id: Number(tubo_id),
      num_paquetes: nuevoStock,
      unidades: nuevasUnidades,
    };
  } catch (error) {
    if (transactionStarted) {
      try {
        const conn = database.getConnection();
        await conn.query('ROLLBACK TRANSACTION');
      } catch (rollbackError) {
        console.error(
          'Error haciendo rollback en salida de paquetes:',
          rollbackError.message,
        );
      }
    }
    console.error('Error creando salida de paquetes:', error.message);
    throw error;
  }
};
