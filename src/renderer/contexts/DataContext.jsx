import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [tiposCalidad, setTiposCalidad] = useState([]);
  const [operarios, setOperarios] = useState([]);

  const loadOperarios = async () => {
    const result = await window.api.operarios.getAll();
    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
        nombre_completo: `${row.nombre} ${row.apellido1} ${row.apellido2}`,
      })),
      total: result.data.length,
    };
  };

  const loadTiposCalidad = async () => {
    const result = await window.api.tiposCalidad.getAll();
    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
      })),
      total: result.data.length,
    };
  };

  const loadData = async () => {
    try {
      const resultTiposCalidad = await loadTiposCalidad();
      setTiposCalidad(resultTiposCalidad.data);
      const resultOperarios = await loadOperarios();
      setOperarios(resultOperarios.data);
    } catch (err) {
      console.log(`Error: ${err?.message ? err?.message : err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        loading,
        tiposCalidad,
        setTiposCalidad,
        operarios,
        setOperarios,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
