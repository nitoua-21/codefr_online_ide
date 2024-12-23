const express = require('express');
const router = express.Router();
const CodeExecutionService = require('../services/CodeExecutionService');

router.post('/execute', async (req, res) => {
  try {
    const { code, input } = req.body;

    // Validate request
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Validate code structure
    await CodeExecutionService.validateCode(code);

    // Execute code
    const result = await CodeExecutionService.executeCode(code, input);

    res.json(result);
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({
      error: error.message || 'Error executing code'
    });
  }
});

module.exports = router;