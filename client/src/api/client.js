import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Base URL - use VITE_API_BASE_URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Required for CORS with credentials
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          
          const { token } = response.data.data;
          localStorage.setItem('authToken', token);
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle different error types
    if (error.response?.status >= 400 && error.response?.status < 500) {
      const message = error.response.data?.error || 'Client error occurred';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } else if (error.response?.status >= 500) {
      toast({
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        variant: 'destructive',
      });
    } else if (error.code === 'NETWORK_ERROR') {
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection.',
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);

export { apiClient, API_BASE_URL };