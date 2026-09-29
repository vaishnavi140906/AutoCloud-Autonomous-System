import api from './api';

export const systemService = {
  getStatus: () => api.get('/system/status'),
  toggleSimulation: (active) => api.post('/system/simulation/toggle', { active }),
  setSimulationSpeed: (intervalMs) =>
    api.post('/system/simulation/speed', { intervalMs }),
  resetDemoData: () => api.post('/system/reset-demo'),
};
