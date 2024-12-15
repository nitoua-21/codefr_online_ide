const express = require('express');
const router = express.Router();

// Get user information
router.get('/', (req, res) => {
  res.json({ message: 'Get user information' });
});

// Register new user
router.post('/', (req, res) => {
  res.json({ message: 'Register new user' });
});

module.exports = router;
