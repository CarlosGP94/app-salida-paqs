import { storagePath } from '../../utils/constants';

export function codificarTextoEspanol(obj) {
  if (obj === null || obj === undefined) return obj;

  // Mapa de caracteres a códigos
  const mapa = {
    á: 'atilde',
    é: 'etilde',
    í: 'itilde',
    ó: 'otilde',
    ú: 'utilde',
    ñ: 'nn',
    Á: 'ATILDE',
    É: 'ETILDE',
    Í: 'ITILDE',
    Ó: 'OTILDE',
    Ú: 'UTILDE',
    Ñ: 'NN',
  };

  // Función interna para reemplazar caracteres en un string
  const reemplazar = (texto) => {
    if (typeof texto !== 'string') return texto;
    let salida = texto;
    for (const [char, code] of Object.entries(mapa)) {
      salida = salida.split(char).join(code);
    }
    return salida;
  };

  // Recorrer objeto o array
  if (Array.isArray(obj)) {
    return obj.map(codificarTextoEspanol);
  } else if (typeof obj === 'object') {
    const nuevoObj = {};
    for (const [key, value] of Object.entries(obj)) {
      nuevoObj[key] = codificarTextoEspanol(value);
    }
    return nuevoObj;
  } else if (typeof obj === 'string') {
    return reemplazar(obj);
  } else {
    return obj; // otros tipos (number, boolean, etc.)
  }
}

export const getImagePath = (image = '') => {
  if (!image) return '';
  const path = storagePath + '\\' + image;
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  return `file://${path.replace(/\\/g, '/')}`;
};

export const resolveSortParams = (model = [], sortFieldMap) => {
  const currentSort = model[0];
  const safeField = currentSort?.field || 'creado';
  const mappedField = sortFieldMap[safeField] || safeField;
  const safeDir = currentSort?.sort === 'asc' ? 'ASC' : 'DESC';

  return {
    orderBy: mappedField,
    orderDir: safeDir,
  };
};
