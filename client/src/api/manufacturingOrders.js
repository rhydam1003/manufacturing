import { apiClient } from './client';

export const manufacturingOrdersAPI = {
  // Get all manufacturing orders with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/manufacturing-orders', { params });
    return response.data?.data || response.data || response;
  },

  // Get single manufacturing order by ID
  getById: async (id) => {
    const response = await apiClient.get(`/manufacturing-orders/${id}`);
    return response.data?.data || response.data || response;
  },

  // Create new manufacturing order
  create: async (data) => {
    const response = await apiClient.post('/manufacturing-orders', data);
    return response.data?.data || response.data || response;
  },

  // Update manufacturing order
  update: async (id, data) => {
    const response = await apiClient.put(`/manufacturing-orders/${id}`, data);
    return response.data?.data || response.data || response;
  },

  // Delete manufacturing order
  delete: async (id) => {
    const response = await apiClient.delete(`/manufacturing-orders/${id}`);
    return response.data?.data || response.data || response;
  },

  // Start production
  startProduction: async (id) => {
    const response = await apiClient.post(`/manufacturing-orders/${id}/start`);
    return response.data?.data || response.data || response;
  },

  // Complete production
  completeProduction: async (id) => {
    const response = await apiClient.post(`/manufacturing-orders/${id}/complete`);
    return response.data?.data || response.data || response;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await apiClient.post(`/manufacturing-orders/${id}/cancel`);
    return response.data?.data || response.data || response;
  },

  // Get work orders for manufacturing order
  getWorkOrders: async (id) => {
    const response = await apiClient.get(`/manufacturing-orders/${id}/work-orders`);
    return response.data?.data || response.data || response;
  },

  // Get material requirements
  getMaterialRequirements: async (id) => {
    const response = await apiClient.get(`/manufacturing-orders/${id}/materials`);
    return response.data?.data || response.data || response;
  },
};