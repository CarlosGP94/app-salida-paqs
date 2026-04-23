export const dataQueries = [
  {
    hoja: 'Mallas',
    query: `
      SELECT 
        id AS [ID],
        art_codigo AS [Código Artículo],
        codigo AS [Código Malla],
        designacion AS [Designación],
        region AS [Región],
        art_concepto AS [Concepto],
        dimensiones AS [Dimensiones],
        diametro AS [Diámetro],
        longitud AS [Longitudinal],
        transversal AS [Transversal],
        peso_por_paquete AS [Peso por paquete],
        sl AS [SL],
        st AS [ST],
        unidades_por_paquete AS [Unidades por paquete],
        created_at AS [Fecha de creación],
        updated_at AS [Fecha de actualización]
      FROM Mallas
    `,
  },
  {
    hoja: 'Fábricas',
    query: `
      SELECT 
        id AS [ID],
        nombre AS [Nombre],
        created_at AS [Fecha de creación],
        updated_at AS [Fecha de actualización]
      FROM Fabricas
    `,
  },
  {
    hoja: 'Máquinas',
    query: `
      SELECT 
        id AS [ID],
        nombre AS [Nombre],
        fabrica_id AS [Fábrica],
        created_at AS [Fecha de creación],
        updated_at AS [Fecha de actualización]
      FROM Maquinas
    `,
  },
  {
    hoja: 'Turnos',
    query: `
      SELECT 
        id AS [ID],
        horario AS [Horario],
        created_at AS [Fecha de creación],
        updated_at AS [Fecha de actualización]
      FROM Turnos
    `,
  },
  {
    hoja: 'Certificados',
    query: `
      SELECT 
        id AS [ID],
        certificado AS [Certificado],
        imagen AS [Imagen],
        created_at AS [Fecha de creación],
        updated_at AS [Fecha de actualización]
      FROM Certificados
    `,
  },
  {
    hoja: 'Mallas-Certificados',
    query: `
      SELECT 
        id AS [ID],
        certificado_id AS [Certificado],
        plantilla_id AS [Plantilla],
        diametro AS [Diámetro],
        created_at AS [Fecha de creación],
        updated_at AS [Fecha de actualización]
      FROM Mallas_certificados
    `,
  },
  {
    hoja: 'Plantillas',
    query: `
      SELECT 
        id AS [ID],
        nombre AS [Nombre],
        titulo AS [Título],
        tipo AS [Designación],
        region AS [Región],
        numero_varillas AS [Número de varillas],
        peso AS [Peso por paquete],
        unidades_paquetes AS [Unidades por paquete],
        lote AS [Lote],
        numero_paquetes AS [Número del paquete],
        created_at AS [Fecha de creación],
        updated_at AS [Fecha de actualización]
      FROM Plantillas
    `,
  },
];

// Mapeo inverso basado en tus dataQueries
export const columnMapping = {
  Mallas: {
    ID: 'id',
    'Código Artículo': 'art_codigo',
    'Código Malla': 'codigo',
    Designación: 'designacion',
    Región: 'region',
    Concepto: 'art_concepto',
    Dimensiones: 'dimensiones',
    Diámetro: 'diametro',
    Longitudinal: 'longitud',
    Transversal: 'transversal',
    'Peso por paquete': 'peso_por_paquete',
    SL: 'sl',
    ST: 'st',
    'Unidades por paquete': 'unidades_por_paquete',
    'Fecha de creación': 'created_at',
    'Fecha de actualización': 'updated_at',
  },
  Fábricas: {
    ID: 'id',
    Nombre: 'nombre',
    'Fecha de creación': 'created_at',
    'Fecha de actualización': 'updated_at',
  },
  Máquinas: {
    ID: 'id',
    Nombre: 'nombre',
    Fábrica: 'fabrica_id',
    'Fecha de creación': 'created_at',
    'Fecha de actualización': 'updated_at',
  },
  Turnos: {
    ID: 'id',
    Horario: 'horario',
    'Fecha de creación': 'created_at',
    'Fecha de actualización': 'updated_at',
  },
  Certificados: {
    ID: 'id',
    Certificado: 'certificado',
    Imagen: 'imagen',
    'Fecha de creación': 'created_at',
    'Fecha de actualización': 'updated_at',
  },
  'Mallas-Certificados': {
    ID: 'id',
    Certificado: 'certificado_id',
    Plantilla: 'plantilla_id',
    Región: 'region',
    Diámetro: 'diametro',
    'Fecha de creación': 'created_at',
    'Fecha de actualización': 'updated_at',
  },
  Plantillas: {
    ID: 'id',
    Nombre: 'nombre',
    Título: 'titulo',
    Designación: 'tipo',
    Región: 'region',
    'Número de varillas': 'numero_varillas',
    'Peso por paquete': 'peso',
    'Unidades por paquete': 'unidades_paquetes',
    Lote: 'lote',
    'Número del paquete': 'numero_paquetes',
    'Fecha de creación': 'created_at',
    'Fecha de actualización': 'updated_at',
  },
};

// Mapa de nombre de hoja a nombre de tabla real
export const tableMapping = {
  Mallas: 'Mallas',
  Fábricas: 'Fabricas',
  Máquinas: 'Maquinas',
  Turnos: 'Turnos',
  Certificados: 'Certificados',
  'Mallas-Certificados': 'Mallas_certificados',
  Plantillas: 'Plantillas',
};

export const unicodeColumns = [
  'designacion',
  'art_concepto',
  'region',
  'nombre',
  'titulo',
  'tipo',
  'certificado',
  'imagen',
  'tipo',
  'numero_varillas',
  'peso',
  'unidades_paquetes',
  'lote',
  'numero_paquetes',
  'titulo',
  'horario',
];

export const ROWS_PER_PAGE_TEMPLATE = 22;
