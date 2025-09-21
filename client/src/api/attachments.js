import { apiClient } from './client';

export const attachmentsAPI = {
  // Upload attachment
  upload: async (formData) => {
    const response = await apiClient.post('/attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data || response.data || response;
  },

  // Get attachments by resource
  getByResource: async (resourceType, resourceId) => {
    const response = await apiClient.get(`/attachments/resource/${resourceType}/${resourceId}`);
    return response.data?.data || response.data || response;
  },

  // Get single attachment by ID
  getById: async (id) => {
    const response = await apiClient.get(`/attachments/${id}`);
    return response.data?.data || response.data || response;
  },

  // Update attachment
  update: async (id, data) => {
    const response = await apiClient.put(`/attachments/${id}`, data);
    return response.data?.data || response.data || response;
  },

  // Delete attachment
  delete: async (id) => {
    const response = await apiClient.delete(`/attachments/${id}`);
    return response.data?.data || response.data || response;
  },
};
