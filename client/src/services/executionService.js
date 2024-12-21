import api from './api';

class ExecutionService {
  async executeCode(code, input = '') {
    try {
      const response = await api.post('/execution/execute', { code, input });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Error executing code');
      }
      throw error;
    }
  }
}

export default new ExecutionService();
