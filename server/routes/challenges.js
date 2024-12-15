const express = require('express');
const router = express.Router();

// Get all challenges
router.get('/', (req, res) => {
  res.json({ message: 'Get all challenges' });
});

// Get challenge by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get challenge by ID' });
});

// Submit solution
router.post('/:id/solutions', (req, res) => {
  res.json({ message: 'Submit solution' });
});

module.exports = router;
