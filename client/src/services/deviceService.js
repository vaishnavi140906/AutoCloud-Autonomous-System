import api from './api';

export const deviceService = {
  getDevices: (params) => api.get('/devices', { params }),
  getDeviceById: (id) => api.get(`/devices/${id}`),
  createDevice: (deviceData) => api.post('/devices', deviceData),
  updateDevice: (id, deviceData) => api.put(`/devices/${id}`, deviceData),
  deleteDevice: (id) => api.delete(`/devices/${id}`),
  sendCommand: (id, command) => api.post(`/devices/${id}/command`, { command }),
};
