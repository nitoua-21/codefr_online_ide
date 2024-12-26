import api from './api';

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw error.response.data.error || 'Une erreur est survenue';
  } else if (error.request) {
    // The request was made but no response was received
    throw 'Impossible de contacter le serveur';
  } else {
    // Something happened in setting up the request that triggered an Error
    throw error.message || 'Une erreur est survenue';
  }
};

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
      throw handleApiError(error);
    }
  },

  // Get a single challenge by ID
  getChallenge: async (id) => {
    try {
      const response = await api.get(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get a single challenge by ID
  getChallengeById: async (id) => {
    try {
      const response = await api.get(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create a new challenge
  createChallenge: async (challengeData) => {
    try {
      const response = await api.post('/challenges', challengeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update a challenge
  updateChallenge: async (id, challengeData) => {
    try {
      const response = await api.put(`/challenges/${id}`, challengeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete a challenge
  deleteChallenge: async (id) => {
    try {
      const response = await api.delete(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Submit a solution for a challenge
  submitSolution: async (challengeId, code) => {
    try {
      //const response = await api.post(`/challenges/${challengeId}/solutions`, { code });
      const response = await api.post(`/solutions/challenge/${challengeId}`, { code });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get user's solutions for a challenge
  getMySolutions: async (challengeId) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/solutions/my`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all solutions for a challenge (admin only)
  getAllSolutions: async (challengeId) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/solutions`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get solution details
  getSolutionById: async (solutionId) => {
    try {
      const response = await api.get(`/solutions/${solutionId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get comments for a challenge
  getComments: async (challengeId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/comments/challenges/${challengeId}/comments`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Add a comment to a challenge
  addComment: async (challengeId, content) => {
    try {
      const response = await api.post(`/comments/challenges/${challengeId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete a comment
  deleteComment: async (challengeId, commentId) => {
    try {
      await api.delete(`/comments/challenges/${challengeId}/comments/${commentId}`);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update solution status
  updateSolutionStatus: async (challengeId, solutionId, status) => {
    try {
      const response = await api.put(`/solutions/${solutionId}/status`, { status });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default challengeService;
