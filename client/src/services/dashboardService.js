import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const dashboardService = {
  getUserStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/stats`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error fetching user statistics';
    }
  },

  getRecentActivity: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/activity`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error fetching recent activity';
    }
  },

  getRecommendedChallenges: async () => {
    try {
      const response = await axios.get(`${API_URL}/challenges/recommended`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error fetching recommended challenges';
    }
  }
};

export default dashboardService;
