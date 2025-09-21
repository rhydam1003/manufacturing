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
      const storedUser = localStorage.getItem('user');
      
      console.log('Checking auth status - Token:', token ? 'Present' : 'Missing', 'User:', storedUser ? 'Present' : 'Missing');
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Check for demo mode token
      if (token === 'demo-jwt-token') {
        if (storedUser) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
          return;
        }
      }

      // If we have stored user data, use it immediately
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'SET_USER', payload: user });
          console.log('Using stored user data');
          
          // Verify with server in background
          authAPI.getCurrentUser().then(response => {
            console.log('Background auth verification successful');
          }).catch(error => {
            console.warn('Background auth verification failed:', error);
          });
          
          return;
        } catch (parseError) {
          console.error('Failed to parse stored user:', parseError);
          localStorage.removeItem('user');
        }
      }

      const response = await authAPI.getCurrentUser();
      console.log('Auth check response:', response);
      
      // Handle different response structures
      let user;
      if (response.data) {
        user = response.data.data || response.data;
      } else {
        user = response;
      }
      
      // Store user data for future use
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Only remove tokens if it's a 401 (unauthorized) error
      if (error.response?.status === 401) {
        console.log('401 error - removing tokens');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } else {
        console.log('Non-401 error - keeping tokens, user can continue');
        // For network errors, keep the user logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
          } catch (parseError) {
            console.error('Failed to parse stored user during error:', parseError);
          }
        }
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await authAPI.login(credentials);
      console.log('Login response:', response);
      
      // Handle different response structures
      let token, user;
      
      if (response.data) {
        if (response.data.data) {
          token = response.data.data.token || response.data.data.accessToken;
          user = response.data.data.user;
        } else {
          token = response.data.token || response.data.accessToken;
          user = response.data.user;
        }
      } else {
        token = response.token || response.accessToken;
        user = response.user;
      }

      if (!token || !user) {
        throw new Error('Invalid response structure from server');
      }

      console.log('Storing token and user:', { token: token ? 'Present' : 'Missing', user: user ? 'Present' : 'Missing' });

      // Store tokens and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Store refresh token if available
      if (response.data?.refreshToken || response.refreshToken) {
        const refreshToken = response.data?.refreshToken || response.refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Refresh token stored');
      }

      dispatch({ type: 'SET_USER', payload: user });
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
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
      console.log('Register response:', response); // Debug log
      
      // Handle different response structures
      let token, user;
      
      if (response.data) {
        // Check if response has nested data structure
        if (response.data.data) {
          token = response.data.data.token || response.data.data.accessToken;
          user = response.data.data.user;
        } else {
          token = response.data.token || response.data.accessToken;
          user = response.data.user;
        }
      } else {
        // Direct response structure
        token = response.token || response.accessToken;
        user = response.user;
      }

      if (!token || !user) {
        throw new Error('Invalid response structure from server');
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'SET_USER', payload: user });
      
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });

      return { success: true };
    } catch (error) {
      console.error('Register error:', error); // Debug log
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
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