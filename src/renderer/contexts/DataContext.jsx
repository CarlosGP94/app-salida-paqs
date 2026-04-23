import React, { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [fabricantes, setFabricantes] = useState([]);
  const [tiposCalidad, setTiposCalidad] = useState([]);
  const [tiposTubos, setTiposTubos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
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

  const loadMaquinas = async () => {
    const result = await window.api.maquinas.getAll();
    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
      })),
      total: result.data.length,
    };
  };

  const loadTiposTubos = async () => {
    const result = await window.api.tubos.getTiposTubos();
    return {
      ...result,
      data: result.data.map((row) => ({
        ...row,
      })),
      total: result.data.length,
    };
  };

  const loadFabricantes = async () => {
    const result = await window.api.fabricantes.getAll();
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
      const resultFabricantes = await loadFabricantes();
      setFabricantes(resultFabricantes.data);
      const resultTiposTubos = await loadTiposTubos();
      setTiposTubos(resultTiposTubos.data);
      const resultMaquinas = await loadMaquinas();
      setMaquinas(resultMaquinas.data);
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
        fabricantes,
        setFabricantes,
        tiposCalidad,
        setTiposCalidad,
        tiposTubos,
        setTiposTubos,
        maquinas,
        setMaquinas,
        operarios,
        setOperarios,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
