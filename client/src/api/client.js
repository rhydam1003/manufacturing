import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Base URL - use VITE_API_BASE_URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Utility function to check if token is valid
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Check if token is a valid JWT format (has 3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode the payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < now) {
      console.log('Token is expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

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
    console.log('API Request - Token:', token ? 'Present' : 'Missing', 'URL:', config.url);
    
    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && !isTokenValid(token)) {
      console.warn('Token is invalid/expired, removing from storage');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } else {
      console.warn('No valid auth token found for request:', config.url);
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

    // Handle JSON parsing errors
    if (error.response && error.response.data && typeof error.response.data === 'string') {
      // Check if response is HTML instead of JSON
      if (error.response.data.includes('<!DOCTYPE') || error.response.data.includes('<html')) {
        const htmlError = new Error('Server returned HTML instead of JSON. Please check if the server is running properly.');
        htmlError.response = error.response;
        htmlError.response.data = { error: 'Server is not responding properly. Please check if the backend server is running.' };
        return Promise.reject(htmlError);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 Unauthorized - attempting token refresh');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          
          const { token } = response.data.data;
          localStorage.setItem('authToken', token);
          console.log('Token refreshed successfully');
          
          return apiClient(originalRequest);
        } else {
          console.log('No refresh token available, redirecting to login');
          // No refresh token, logout user
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
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
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection and server status.',
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);

export { apiClient, API_BASE_URL };