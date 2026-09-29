import api from './api';

export const alertService = {
  getAlerts: (params) => api.get('/alerts', { params }),
  resolveAlert: (id, resolutionNotes) =>
    api.put(`/alerts/${id}/resolve`, { resolutionNotes }),
  injectAnomaly: (deviceId, anomalyType) =>
    api.post('/alerts/inject', { deviceId, anomalyType }),
  clearResolved: () => api.delete('/alerts/clear-resolved'),
};
