import api from './api';

export const missionService = {
  getMissions: (params) => api.get('/missions', { params }),
  getMissionById: (id) => api.get(`/missions/${id}`),
  createMission: (missionData) => api.post('/missions', missionData),
  updateMission: (id, missionData) => api.put(`/missions/${id}`, missionData),
  deleteMission: (id) => api.delete(`/missions/${id}`),
};
