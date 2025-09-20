import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '../types';
import { apiRequest } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await apiRequest.post<AuthResponse>('/auth/login', {
            email,
            password,
          });

          if (response.success && response.data) {
            const { token, user } = response.data;
            localStorage.setItem('auth_token', token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            toast.success('Login successful!');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true });
          const response = await apiRequest.post<AuthResponse>('/auth/register', data);

          if (response.success && response.data) {
            const { token, user } = response.data;
            localStorage.setItem('auth_token', token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            toast.success('Registration successful!');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Logged out successfully');
      },

      getCurrentUser: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          if (!token) return;

          const response = await apiRequest.get<User>('/auth/me');
          if (response.success && response.data) {
            set({
              user: response.data,
              token,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          // Token might be invalid, clear auth state
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);