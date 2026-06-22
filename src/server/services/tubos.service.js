import database from '../../db/database';
import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import pathModule from 'path';
import { ROWS_PER_PAGE_TEMPLATE } from '../utils/constants';
import { orderQuery } from '../utils/functions';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPeso(value = 0) {
  return `${Number(value).toFixed(2)} Tn`;
}

function resolveTemplatePath() {
  const candidates = [
    pathModule.join(
      app.getAppPath(),
      'src',
      'server',
      'plantillas',
      'informe_tubos.html',
    ),
    pathModule.join(
      app.getAppPath(),
      'server',
      'plantillas',
      'informe_tubos.html',
    ),
    pathModule.join(__dirname, '..', 'plantillas', 'informe_tubos.html'),
  ];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error('No se encontro la plantilla informe_tubos.html');
  }

  return found;
}

function resolveOutputFilePath(destinationPath = '') {
  const resolvedDestination = destinationPath?.trim()
    ? pathModule.resolve(destinationPath)
    : app.getAppPath();

  const extension = pathModule.extname(resolvedDestination).toLowerCase();
  if (extension === '.pdf') {
    return resolvedDestination;
  }

  const stamp = new Date().toISOString().replace(/[.:]/g, '-');
  return pathModule.join(resolvedDestination, `informe-tubos-${stamp}.pdf`);
}

export async function listarTodosTubosService({ calidad_id = null }) {
  try {
    const conn = database.getConnection();

    let whereClauses = ['1=1'];

    if (calidad_id && calidad_id !== 0) {
      whereClauses.push(`calidad_id = ${calidad_id}`);
    }
    const whereSQL = whereClauses.join(' AND ');
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Tubos
      WHERE ${whereSQL} AND activo = 1
    `;
    const countResult = await conn.query(countQuery);
    const total = countResult[0]?.total ? Number(countResult[0].total) : 0;

    const selectQuery = `
      SELECT
        t.id,
        t.medida,
        t.creado,
        t.calidad_id,
        t.num_paquetes,
        t.unidades
      FROM Tubos AS t
      LEFT JOIN Tipos_Calidad AS tc ON t.calidad_id = tc.id
      LEFT JOIN Tipos_Tubos AS tt ON t.tipo_id = tt.id
      WHERE ${whereSQL} AND activo = 1
      ORDER BY tc.nombre,
        t.espesor,
        tt.nombre,
        t.ancho,
        t.alto,
        t.diametro,
        t.id ASC
    `;

    const rows = await conn.query(selectQuery);

    return {
      data: rows.map((row) => ({
        id: Number(row.id),
        medida: row.medida,
        creado: row.creado,
        calidad_id: row.calidad_id ? Number(row.calidad_id) : null,
        num_paquetes: row.num_paquetes ? Number(row.num_paquetes) : null,
        unidades: row.unidades,
      })),
      total,
    };
  } catch (error) {
    console.error('Error listando tubos:', error.message);
    throw error;
  }
}

export async function listarTubosService({
  page = 1,
  pageSize = 20,
  orderBy,
  orderDir,
  calidad_id,
  tipo_id,
  maquina_id,
  tubo_id,
  activo,
  searchTerm = '',
} = {}) {
  try {
    const conn = database.getConnection();
    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.max(1, Number(pageSize) || 20);
    const offset = (safePage - 1) * safePageSize;

    const allowedOrderBy = {
      id: 't.id',
      calidad: 'tc.nombre',
      tipo: 'tt.nombre',
      maquina: 'tt.nombre',
      art_concepto: 't.art_concepto',
      activo: 't.activo',
      ancho: 't.ancho',
      alto: 't.alto',
      longitud: 't.longitud',
      diametro: 't.diametro',
      espesor: 't.espesor',
      creado: 't.creado',
    };

    const hasFilters = Boolean(
      searchTerm ||
      (tubo_id && Number(tubo_id) !== 0) ||
      (calidad_id && Number(calidad_id) !== 0) ||
      (tipo_id && Number(tipo_id) !== 0) ||
      (maquina_id && Number(maquina_id) !== 0) ||
      (activo !== undefined && activo !== null),
    );

    const safeOrderBy = orderBy
      ? allowedOrderBy[String(orderBy)]
      : !hasFilters
        ? ''
        : '';
    const safeOrderDir =
      String(orderDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClauses = ['1=1'];

    if (searchTerm) {
      whereClauses.push(`
        (
          t.medida LIKE '%${searchTerm}%'
          OR t.art_concepto LIKE '%${searchTerm}%'
        )
      `);
    }
    if (tubo_id && Number(tubo_id) > 0) {
      whereClauses.push(`t.id = ${Number(tubo_id)}`);
    }
    if (calidad_id && Number(calidad_id) !== 0) {
      whereClauses.push(`t.calidad_id = ${Number(calidad_id)}`);
    }
    if (tipo_id && Number(tipo_id) !== 0) {
      whereClauses.push(`t.tipo_id = ${Number(tipo_id)}`);
    }
    if (maquina_id && Number(maquina_id) !== 0) {
      whereClauses.push(`EXISTS (
        SELECT 1
        FROM Tubos_Maquinas tmf
        WHERE tmf.tubo_id = t.id
          AND tmf.maquina_id = ${Number(maquina_id)}
      )`);
    }
    if (activo !== undefined && activo !== null) {
      whereClauses.push(`t.activo = ${activo ? 1 : 0}`);
    }

    const whereSQL = whereClauses.join(' AND ');

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Tubos t
      WHERE ${whereSQL}
    `;
    const countResult = await conn.query(countQuery);
    const total = countResult[0]?.total ? Number(countResult[0].total) : 0;

    let orderBySQL = orderQuery({
      secondaryOrderCols: [
        'tc.nombre',
        't.espesor',
        'tt.nombre',
        't.ancho',
        't.alto',
        't.diametro',
        't.id',
      ],
      safeOrderBy,
      safeOrderDir,
    });

    const start = (page - 1) * pageSize + 1;
    const end = start + pageSize - 1;
    const selectQuery = `
;WITH TubosCTE AS (
    SELECT
        t.id,
        t.medida,
        t.ancho,
        t.alto,
        t.longitud,
        t.art_concepto,
        t.espesor,
        t.diametro,
        t.unidades,
        t.peso_unitario,
        t.peso_total,
        t.activo,
        t.num_paquetes,
        t.num_por_paq,
        t.alto_paq,
        t.ancho_paq,
        t.creado,
        t.calidad_id,
        t.tipo_id,
        t.fleje_id,
        tc.nombre AS calidad_nombre,
        tt.nombre AS tipo_nombre,
        f.concepto AS fleje_concepto,
        tm_rel.maquinas_ids,
        tm_rel.maquinas_nombres,
        ROW_NUMBER() OVER (ORDER BY ${orderBySQL}) AS rn
    FROM Tubos t
    LEFT JOIN Tipos_Calidad tc ON t.calidad_id = tc.id
    LEFT JOIN Tipos_Tubos tt ON t.tipo_id = tt.id
    LEFT JOIN Flejes f ON t.fleje_id = f.id
    OUTER APPLY (
        SELECT 
            STUFF((
                SELECT ',' + CAST(tm.maquina_id AS VARCHAR(20))
                FROM Tubos_Maquinas tm
                WHERE tm.tubo_id = t.id
                FOR XML PATH(''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 1, '') AS maquinas_ids,
            
            STUFF((
                SELECT '||' + COALESCE(m.maquina, m.nombre)
                FROM Tubos_Maquinas tm
                LEFT JOIN Maquinas m ON tm.maquina_id = m.id
                WHERE tm.tubo_id = t.id
                FOR XML PATH(''), TYPE).value(N'.', N'NVARCHAR(MAX)'), 1, 2, '') AS maquinas_nombres
    ) tm_rel
    WHERE ${whereSQL}
)
SELECT 
    id,
    medida,
    ancho,
    alto,
    longitud,
    art_concepto,
    espesor,
    diametro,
    unidades,
    peso_unitario,
    peso_total,
    activo,
    num_paquetes,
    num_por_paq,
    alto_paq,
    ancho_paq,
    creado,
    calidad_id,
    tipo_id,
    fleje_id,
    calidad_nombre,
    tipo_nombre,
    fleje_concepto,
    rn,
    maquinas_ids,
    maquinas_nombres
FROM TubosCTE
WHERE rn BETWEEN ${start} AND ${end};
    `;

    const rows = await conn.query(selectQuery);

    return {
      data: rows.map((row) => {
        const maquinasIds = row.maquinas_ids
          ? String(row.maquinas_ids)
              .split(',')
              .map((value) => Number(value))
              .filter((value) => Number.isFinite(value) && value > 0)
          : [];

        const maquinasNombres = row.maquinas_nombres
          ? String(row.maquinas_nombres).split('||')
          : [];

        const maquinas = maquinasIds.map((id, index) => ({
          id,
          maquina: maquinasNombres[index] || 'N/A',
        }));

        return {
          id: Number(row.id),
          calidad_id: Number(row.calidad_id),
          calidad_nombre: row.calidad_nombre || 'N/A',
          tipo_id: Number(row.tipo_id),
          unidades: Number(row.unidades),
          num_paquetes: Number(row.num_paquetes),
          tipo_nombre: row.tipo_nombre || 'N/A',
          maquinas,
          maquina: maquinas.map((item) => item.maquina).join(', ') || 'N/A',
          fleje_id: row.fleje_id ? Number(row.fleje_id) : null,
          fleje_concepto: row.fleje_concepto || 'N/A',
          art_concepto: row.art_concepto,
          medida: row.medida,
          activo: Number(row.activo),
          ancho: Number(row.ancho),
          alto: Number(row.alto),
          longitud: Number(row.longitud),
          diametro: Number(row.diametro),
          espesor: Number(row.espesor),
          peso_unitario: Number(row.peso_unitario),
          peso_total: Number(row.peso_total),
          num_por_paq: Number(row.num_por_paq),
          alto_paq: Number(row.alto_paq),
          ancho_paq: Number(row.ancho_paq),
          creado: row.creado,
        };
      }),
      total,
    };
  } catch (error) {
    console.error('Error listando tubos:', error.message);
    throw error;
  }
}
