import api from './api';

export const analyticsService = {
  getDashboardMetrics: () => api.get('/analytics/dashboard'),
  getTrends: (timeRange = '7d') =>
    api.get('/analytics/trends', { params: { timeRange } }),
};
