import { apiClient } from './client';

export const productsAPI = {
  // Get all products with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/products', { params });
    return response.data?.data || response.data || response;
  },

  // Get single product by ID
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data?.data || response.data || response;
  },

  // Create new product
  create: async (data) => {
    const response = await apiClient.post('/products', data);
    return response.data?.data || response.data || response;
  },

  // Update product
  update: async (id, data) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data?.data || response.data || response;
  },

  // Delete product
  delete: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data?.data || response.data || response;
  },
};
