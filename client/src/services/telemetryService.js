import api from './api';

export const telemetryService = {
  ingestTelemetry: (telemetryData) => api.post('/telemetry', telemetryData),
  getHistory: (params) => api.get('/telemetry', { params }),
  getDeviceTelemetry: (deviceId, limit = 30) =>
    api.get(`/telemetry/${deviceId}`, { params: { limit } }),
  exportCSV: (deviceId) =>
    api.get('/telemetry/export/csv', {
      params: { deviceId },
      responseType: 'blob',
    }),
};
