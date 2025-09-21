import { apiClient } from './client';

export const dashboardAPI = {
  // Get dashboard stats
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data?.data || response.data || response;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    const response = await apiClient.get('/dashboard/recent-activity', { 
      params: { limit } 
    });
    return response.data?.data || response.data || response;
  },

  // Get alerts
  getAlerts: async () => {
    const response = await apiClient.get('/dashboard/alerts');
    return response.data?.data || response.data || response;
  },
};
