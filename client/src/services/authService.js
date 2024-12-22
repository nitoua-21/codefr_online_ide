import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error during registration';
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error during login';
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/users/logout`, {}, {
        withCredentials: true
      });
      return true;
    } catch (error) {
      throw error.response?.data?.error || 'Error during logout';
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error getting current user';
    }
  },

  // Setup axios interceptor for authentication
  setupAxiosInterceptors: (logout) => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
  }
};

export default authService;
