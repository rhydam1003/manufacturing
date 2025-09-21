import { apiClient } from './client';

export const bomAPI = {
  // Get all BOMs with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/bom', { params });
    return response.data?.data || response.data || response;
  },

  // Get single BOM by ID
  getById: async (id) => {
    const response = await apiClient.get(`/bom/${id}`);
    return response.data?.data || response.data || response;
  },

  // Create new BOM
  create: async (data) => {
    const response = await apiClient.post('/bom', data);
    return response.data?.data || response.data || response;
  },

  // Update BOM
  update: async (id, data) => {
    const response = await apiClient.put(`/bom/${id}`, data);
    return response.data?.data || response.data || response;
  },

  // Delete BOM
  delete: async (id) => {
    const response = await apiClient.delete(`/bom/${id}`);
    return response.data?.data || response.data || response;
  },

  // Toggle BOM active status
  toggleActive: async (id) => {
    const response = await apiClient.patch(`/bom/${id}/toggle-active`);
    return response.data?.data || response.data || response;
  },

  // Calculate BOM cost
  getCost: async (id) => {
    const response = await apiClient.get(`/bom/${id}/cost`);
    return response.data?.data || response.data || response;
  },

  // Get product usage in BOMs
  getProductUsage: async (id) => {
    const response = await apiClient.get(`/bom/product/${id}/usage`);
    return response.data?.data || response.data || response;
  },
};
