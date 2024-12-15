const express = require('express');
const router = express.Router();

// Get all snippets
router.get('/', (req, res) => {
  res.json({ message: 'Get all snippets' });
});

// Create new snippet
router.post('/', (req, res) => {
  res.json({ message: 'Create new snippet' });
});

// Get snippet by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get snippet by ID' });
});

// Update snippet
router.put('/:id', (req, res) => {
  res.json({ message: 'Update snippet' });
});

// Delete snippet
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete snippet' });
});

module.exports = router;
