import { apiClient } from './client';

export const workCentersAPI = {
  // Get all work centers with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/work-centers', { params });
    return response.data?.data || response.data || response;
  },

  // Get single work center by ID
  getById: async (id) => {
    const response = await apiClient.get(`/work-centers/${id}`);
    return response.data?.data || response.data || response;
  },

  // Create new work center
  create: async (data) => {
    const response = await apiClient.post('/work-centers', data);
    return response.data?.data || response.data || response;
  },

  // Update work center
  update: async (id, data) => {
    const response = await apiClient.put(`/work-centers/${id}`, data);
    return response.data?.data || response.data || response;
  },

  // Delete work center
  delete: async (id) => {
    const response = await apiClient.delete(`/work-centers/${id}`);
    return response.data?.data || response.data || response;
  },

  // Get work center utilization
  getUtilization: async (id, params = {}) => {
    const response = await apiClient.get(`/work-centers/${id}/utilization`, { params });
    return response.data?.data || response.data || response;
  },

  // Get all work centers utilization
  getAllUtilization: async (params = {}) => {
    const response = await apiClient.get('/work-centers/utilization', { params });
    return response.data?.data || response.data || response;
  },

  // Update work center downtime
  updateDowntime: async (id, downtime) => {
    const response = await apiClient.put(`/work-centers/${id}/downtime`, { downtime });
    return response.data?.data || response.data || response;
  },

  // Get work center stats
  getStats: async () => {
    const response = await apiClient.get('/work-centers/stats');
    return response.data?.data || response.data || response;
  },
};
