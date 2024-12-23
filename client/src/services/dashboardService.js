import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const dashboardService = {
  getUserStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error fetching user statistics';
    }
  },

  getRecentActivity: async () => {
    try {
      const response = await api.get('/dashboard/activity');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error fetching recent activity';
    }
  },

  getRecommendedChallenges: async () => {
    try {
      const response = await api.get('/challenges?type=recommended');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error fetching recommended challenges';
    }
  }
};

export default dashboardService;
