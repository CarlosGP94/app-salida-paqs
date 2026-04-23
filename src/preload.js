import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  chrome: process.versions['chrome'],
  node: process.versions['node'],
  electron: process.versions['electron'],
});

contextBridge.exposeInMainWorld('api', {
  tiposCalidad: {
    getAll: () => ipcRenderer.invoke('tiposCalidad:getAll'),
  },
  operarios: {
    getAll: () => ipcRenderer.invoke('operarios:getAll'),
  },
  tubos: {
    getAllForSelects: (payload) =>
      ipcRenderer.invoke('tubos:getAllForSelects', payload),
  },
  salidasPaq: {
    getAll: (payload) => ipcRenderer.invoke('salidasPaq:getAll', payload),
  },
});
