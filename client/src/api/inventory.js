import { apiClient } from './client';

export const inventoryAPI = {
  // Get inventory levels
  getLevels: async (params = {}) => {
    const response = await apiClient.get('/inventory', { params });
    return response.data;
  },

  // Get product inventory
  getProductInventory: async (productId) => {
    const response = await apiClient.get(`/inventory/product/${productId}`);
    return response.data;
  },

  // Adjust inventory
  adjust: async (data) => {
    const response = await apiClient.post('/inventory/adjust', data);
    return response.data;
  },

  // Transfer stock
  transfer: async (data) => {
    const response = await apiClient.post('/inventory/transfer', data);
    return response.data;
  },

  // Get low stock alerts
  getAlerts: async () => {
    const response = await apiClient.get('/inventory/alerts');
    return response.data;
  },
};
