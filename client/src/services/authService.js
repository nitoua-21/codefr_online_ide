import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'token';

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error during registration';
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error during login';
    }
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      return true;
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error('No token found');
      }
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
      }
      throw error.response?.data?.message || 'Error getting current user';
    }
  },

  // Setup axios interceptor for authentication
  setupAxiosInterceptors: (logout) => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      }
    );
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error requesting password reset';
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error resetting password';
    }
  }
};

export default authService;
