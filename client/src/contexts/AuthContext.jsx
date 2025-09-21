import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '@/api/auth';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Check for demo mode token
      if (token === 'demo-jwt-token') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
          return;
        }
      }

      const response = await authAPI.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: response.data });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Always use backend for login, including demo credentials
      const response = await authAPI.login(credentials);
      // Support both { token, user } and { accessToken, user }
      const token = response.data.token || response.data.accessToken;
      const user = response.data.user;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'SET_USER', payload: user });
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'SET_USER', payload: user });
      
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      
      toast({
        title: 'Success',
        description: 'Logged out successfully!',
      });
    }
  };

  const forgotPassword = async (email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.forgotPassword(email);
      
      toast({
        title: 'Success',
        description: 'Password reset OTP sent to your email!',
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset email';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetPassword = async (data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authAPI.resetPassword(data);
      
      toast({
        title: 'Success',
        description: 'Password reset successfully!',
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password reset failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};