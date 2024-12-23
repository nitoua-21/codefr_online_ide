import api from './api';

const challengeService = {
  // Get all published challenges with filters
  getChallenges: async (page = 1, limit = 10, filters = {}) => {
    try {
      const { difficulty, category, search, tag, sortBy } = filters;
      const response = await api.get('/challenges', {
        params: { page, limit, difficulty, category, search, tag, sortBy }
      });
      return response.data;
    } catch (error) {
      console.error('Get challenges error:', error);
      throw error.response?.data?.error || 'Error fetching challenges';
    }
  },

  // Get a single challenge by ID
  getChallengeById: async (id) => {
    try {
      const response = await api.get(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get challenge error:', error);
      throw error.response?.data?.error || 'Error fetching challenge';
    }
  },

  // Create a new challenge
  createChallenge: async (challengeData) => {
    try {
      const response = await api.post('/challenges', challengeData);
      return response.data;
    } catch (error) {
      console.error('Create challenge error:', error);
      throw error.response?.data?.error || 'Error creating challenge';
    }
  },

  // Update a challenge
  updateChallenge: async (id, challengeData) => {
    try {
      const response = await api.put(`/challenges/${id}`, challengeData);
      return response.data;
    } catch (error) {
      console.error('Update challenge error:', error);
      throw error.response?.data?.error || 'Error updating challenge';
    }
  },

  // Delete a challenge
  deleteChallenge: async (id) => {
    try {
      const response = await api.delete(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete challenge error:', error);
      throw error.response?.data?.error || 'Error deleting challenge';
    }
  },

  // Submit a solution for a challenge
  submitSolution: async (challengeId, code) => {
    try {
      const response = await api.post(`/challenges/${challengeId}/solutions`, { code });
      return response.data;
    } catch (error) {
      console.error('Submit solution error:', error);
      throw error.response?.data?.error || 'Error submitting solution';
    }
  },

  // Get user's solutions for a challenge
  getMySolutions: async (challengeId) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/solutions/my`);
      return response.data;
    } catch (error) {
      console.error('Get my solutions error:', error);
      throw error.response?.data?.error || 'Error fetching your solutions';
    }
  },

  // Get all solutions for a challenge (admin only)
  getAllSolutions: async (challengeId) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/solutions`);
      return response.data;
    } catch (error) {
      console.error('Get all solutions error:', error);
      throw error.response?.data?.error || 'Error fetching solutions';
    }
  },

  // Get solution details
  getSolutionById: async (solutionId) => {
    try {
      const response = await api.get(`/solutions/${solutionId}`);
      return response.data;
    } catch (error) {
      console.error('Get solution error:', error);
      throw error.response?.data?.error || 'Error fetching solution';
    }
  }
};

export default challengeService;
