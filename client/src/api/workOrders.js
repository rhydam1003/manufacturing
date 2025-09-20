import { apiClient } from './client';

export const workOrdersAPI = {
  // Get all work orders with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/work-orders', { params });
    return response.data;
  },

  // Get single work order by ID
  getById: async (id) => {
    const response = await apiClient.get(`/work-orders/${id}`);
    return response.data;
  },

  // Create new work order
  create: async (data) => {
    const response = await apiClient.post('/work-orders', data);
    return response.data;
  },

  // Update work order
  update: async (id, data) => {
    const response = await apiClient.put(`/work-orders/${id}`, data);
    return response.data;
  },

  // Delete work order
  delete: async (id) => {
    const response = await apiClient.delete(`/work-orders/${id}`);
    return response.data;
  },

  // Start work order
  start: async (id, data) => {
    const response = await apiClient.post(`/work-orders/${id}/start`, data);
    return response.data;
  },

  // Pause work order
  pause: async (id, data) => {
    const response = await apiClient.post(`/work-orders/${id}/pause`, data);
    return response.data;
  },

  // Complete work order
  complete: async (id, data) => {
    const response = await apiClient.post(`/work-orders/${id}/complete`, data);
    return response.data;
  },

  // Cancel work order
  cancel: async (id, data) => {
    const response = await apiClient.post(`/work-orders/${id}/cancel`, data);
    return response.data;
  },

  // Get work order stats
  getStats: async () => {
    const response = await apiClient.get('/work-orders/stats');
    return response.data;
  },
};
