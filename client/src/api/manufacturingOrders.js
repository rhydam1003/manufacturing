import { apiClient } from './client';

export const manufacturingOrdersAPI = {
  // Get all manufacturing orders with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/manufacturing-orders', { params });
    return response.data;
  },

  // Get single manufacturing order by ID
  getById: async (id) => {
    const response = await apiClient.get(`/manufacturing-orders/${id}`);
    return response.data;
  },

  // Create new manufacturing order
  create: async (data) => {
    const response = await apiClient.post('/manufacturing-orders', data);
    return response.data;
  },

  // Update manufacturing order
  update: async (id, data) => {
    const response = await apiClient.put(`/manufacturing-orders/${id}`, data);
    return response.data;
  },

  // Delete manufacturing order
  delete: async (id) => {
    const response = await apiClient.delete(`/manufacturing-orders/${id}`);
    return response.data;
  },

  // Start production
  startProduction: async (id) => {
    const response = await apiClient.post(`/manufacturing-orders/${id}/start`);
    return response.data;
  },

  // Complete production
  completeProduction: async (id) => {
    const response = await apiClient.post(`/manufacturing-orders/${id}/complete`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await apiClient.post(`/manufacturing-orders/${id}/cancel`);
    return response.data;
  },

  // Get work orders for manufacturing order
  getWorkOrders: async (id) => {
    const response = await apiClient.get(`/manufacturing-orders/${id}/work-orders`);
    return response.data;
  },

  // Get material requirements
  getMaterialRequirements: async (id) => {
    const response = await apiClient.get(`/manufacturing-orders/${id}/materials`);
    return response.data;
  },
};