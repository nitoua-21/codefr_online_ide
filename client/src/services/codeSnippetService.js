import api from './api';

const codeSnippetService = {
  // Create a new code snippet
  createSnippet: async (snippetData) => {
    try {
      const response = await api.post('/code-snippets', snippetData);
      return response.data;
    } catch (error) {
      console.error('Create snippet error:', error);
      throw error.response?.data?.error || 'Error creating snippet';
    }
  },

  // Get a specific snippet by ID
  getSnippetById: async (id) => {
    try {
      const response = await api.get(`/code-snippets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get snippet error:', error);
      throw error.response?.data?.error || 'Error getting snippet';
    }
  },

  // Alias for getSnippetById for backward compatibility
  getSnippet: async (id) => {
    return codeSnippetService.getSnippetById(id);
  },

  // Get all snippets for the current user
  getMySnippets: async () => {
    try {
      console.log('Fetching user snippets...');
      const response = await api.get('/code-snippets/my');
      console.log('Received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get my snippets error:', error);
      throw error.response?.data?.error || 'Error getting your snippets';
    }
  },

  // Get public snippets
  getPublicSnippets: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/code-snippets/public?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get public snippets error:', error);
      throw error.response?.data?.error || 'Error getting public snippets';
    }
  },

  // Update a snippet
  updateSnippet: async (id, snippetData) => {
    try {
      const response = await api.put(`/code-snippets/${id}`, snippetData);
      return response.data;
    } catch (error) {
      console.error('Update snippet error:', error);
      throw error.response?.data?.error || 'Error updating snippet';
    }
  },

  // Delete a snippet
  deleteSnippet: async (id) => {
    try {
      const response = await api.delete(`/code-snippets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete snippet error:', error);
      throw error.response?.data?.error || 'Error deleting snippet';
    }
  },

  // Like a snippet
  likeSnippet: async (id) => {
    try {
      const response = await api.post(`/code-snippets/${id}/like`);
      return response.data;
    } catch (error) {
      console.error('Like snippet error:', error);
      throw error.response?.data?.error || 'Error liking snippet';
    }
  },

  // Unlike a snippet
  unlikeSnippet: async (id) => {
    try {
      const response = await api.delete(`/code-snippets/${id}/like`);
      return response.data;
    } catch (error) {
      console.error('Unlike snippet error:', error);
      throw error.response?.data?.error || 'Error unliking snippet';
    }
  },

  // Add a comment to a snippet
  addComment: async (snippetId, content) => {
    try {
      const response = await api.post(`/code-snippets/${snippetId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error.response?.data?.error || 'Error adding comment';
    }
  },

  // Delete a comment from a snippet
  deleteComment: async (snippetId, commentId) => {
    try {
      const response = await api.delete(`/code-snippets/${snippetId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error.response?.data?.error || 'Error deleting comment';
    }
  },

  // Fork a snippet
  forkSnippet: async (id) => {
    try {
      const response = await api.post(`/code-snippets/${id}/fork`);
      return response.data;
    } catch (error) {
      console.error('Fork snippet error:', error);
      throw error.response?.data?.error || 'Error forking snippet';
    }
  }
};

export default codeSnippetService;
