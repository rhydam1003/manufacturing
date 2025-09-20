import { apiClient } from './client';

export const dashboardAPI = {
  // Get dashboard stats
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    const response = await apiClient.get('/dashboard/recent-activity', { 
      params: { limit } 
    });
    return response.data;
  },

  // Get alerts
  getAlerts: async () => {
    const response = await apiClient.get('/dashboard/alerts');
    return response.data;
  },
};
