import database from '../../db/database';
import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import pathModule from 'path';
import { ROWS_PER_PAGE_TEMPLATE } from '../utils/constants';

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
      WHERE ${whereSQL}
    `;
    const countResult = await conn.query(countQuery);
    const total = countResult[0]?.total ? Number(countResult[0].total) : 0;

    const selectQuery = `
      SELECT
        id,
        medida,
        creado,
        calidad_id,
        num_paquetes,
        unidades
      FROM Tubos
      WHERE ${whereSQL}
      ORDER BY creado DESC
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
