import api from './api';

const statsService = {
  getStats: async () => {
    try {
      const [snippetsRes, usersRes] = await Promise.all([
        api.get('/code-snippets/public?page=1&limit=1'),
        api.get('/users/count')
      ]);
      
      // Calculate comments count from snippets
      const commentsCount = snippetsRes.data.snippets?.reduce((total, snippet) => {
        return total + (snippet.comments?.length || 0);
      }, 0) || 0;
      
      return {
        snippetsCount: snippetsRes.data.total || 0,
        usersCount: usersRes.data.count || 0,
        commentsCount: commentsCount
      };
    } catch (error) {
      console.error('Get stats error:', error);
      throw error.response?.data?.error || 'Error fetching stats';
    }
  }
};

export default statsService;
