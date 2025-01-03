import { useDeprecatedAnimatedState } from 'framer-motion';
import api from './api';

const userService = {
  updateProfile: async (userData) => {
    try {
      userData = { ...userData, role: userData.email === 'nitoua.dev@gmail.com' ? 'admin' : 'standard' };
      console.log('Updated user data:', userData);
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePreferences: async (preferencesData) => {
    try {
      const response = await api.put('/users/preferences', preferencesData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
