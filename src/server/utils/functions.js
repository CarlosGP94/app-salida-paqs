export const formatFecha = (fechaRaw) => {
  if (!fechaRaw || fechaRaw === '-') return '-';
  const d = new Date(fechaRaw);

  if (isNaN(d.getTime())) return '-';
  const pad = (n) => n.toString().padStart(2, '0');
  const datePart = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  return `${datePart} ${timePart}`;
};

export const orderQuery = ({
  secondaryOrderCols = [],
  safeOrderBy,
  safeOrderDir,
}) => {
  let orderBySQL;
  const orderParts = [];
  if (safeOrderBy && safeOrderDir)
    orderParts.push(`${safeOrderBy} ${safeOrderDir}`);
  for (const col of secondaryOrderCols) {
    if (col !== safeOrderBy && !orderParts.some((p) => p.startsWith(col))) {
      orderParts.push(`${col} ${safeOrderDir || 'ASC'}`);
    }
  }
  return orderParts.join(', ');
};

export function fixEncoding(str) {
  return Buffer.from(str, 'latin1').toString('utf8');
}

export function arreglarUTF8(texto) {
  if (!texto) return texto;
  return Buffer.from(texto, 'binary').toString('utf8');
}

export function convertirAUTF16(str) {
  if (!str) return str;
  return Buffer.from(str, 'utf8').toString('utf16le');
}

export function toSqlServerUnicode(str) {
  if (!str) return null;
  return Buffer.from(str, 'utf16le'); // codifica en UTF-16LE
}

export function arreglarTextoEspanol(texto) {
  if (!texto) return texto;

  const mapa = {
    // Vocales minúsculas
    atilde: 'á',
    etilde: 'é',
    itilde: 'í',
    otilde: 'ó',
    utilde: 'ú',
    nn: 'ñ',

    // Vocales mayúsculas
    ATILDE: 'Á',
    ETILDE: 'É',
    ITILDE: 'Í',
    OTILDE: 'Ó',
    UTILDE: 'Ú',
    NN: 'Ñ',
  };

  let salida = texto;

  for (const [mal, bien] of Object.entries(mapa)) {
    while (salida.includes(mal)) {
      console.log(
        `Detectado carácter especial: "${mal}" -> se reemplazará por "${bien}"`,
      );
      salida = salida.replace(mal, bien);
    }
  }

  return salida;
}
