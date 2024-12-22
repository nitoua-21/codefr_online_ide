const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Solution = require('../models/Solution');
const auth = require('../middleware/auth');

// Create a new challenge
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      initialCode,
      testCases,
      hints,
      solution,
      timeLimit,
      memoryLimit,
      tags
    } = req.body;

    const challenge = new Challenge({
      title,
      description,
      difficulty,
      category,
      initialCode,
      testCases,
      hints,
      solution,
      timeLimit,
      memoryLimit,
      tags,
      author: req.user._id
    });

    await challenge.save();

    res.status(201).json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all published challenges with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      difficulty,
      category,
      search,
      tag,
      sortBy = '-createdAt'
    } = req.query;

    const query = { status: 'published' };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (tag) {
      query.tags = tag;
    }

    const challenges = await Challenge.find(query)
      .populate('author', 'username')
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Challenge.countDocuments(query);

    res.json({
      success: true,
      challenges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('author', 'username');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Hide solution and hidden test cases for non-authors
    if (!req.user || !challenge.author._id.equals(req.user._id)) {
      challenge.solution = undefined;
      challenge.testCases = challenge.testCases.filter(test => !test.isHidden);
    }

    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update challenge
router.put('/:id', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check ownership
    if (!challenge.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this challenge'
      });
    }

    const {
      title,
      description,
      difficulty,
      category,
      initialCode,
      testCases,
      hints,
      solution,
      timeLimit,
      memoryLimit,
      tags,
      status
    } = req.body;

    // Update fields
    if (title) challenge.title = title;
    if (description) challenge.description = description;
    if (difficulty) challenge.difficulty = difficulty;
    if (category) challenge.category = category;
    if (initialCode) challenge.initialCode = initialCode;
    if (testCases) challenge.testCases = testCases;
    if (hints) challenge.hints = hints;
    if (solution) challenge.solution = solution;
    if (timeLimit) challenge.timeLimit = timeLimit;
    if (memoryLimit) challenge.memoryLimit = memoryLimit;
    if (tags) challenge.tags = tags;
    if (status) challenge.status = status;

    await challenge.save();

    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete challenge
router.delete('/:id', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check ownership
    if (!challenge.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this challenge'
      });
    }

    await challenge.remove();

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Submit solution
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    const { code } = req.body;

    const solution = new Solution({
      challenge: challenge._id,
      user: req.user._id,
      code,
      status: 'pending',
      executionStats: {
        totalTests: challenge.testCases.length
      }
    });

    await solution.save();

    // Update challenge statistics
    challenge.statistics.totalAttempts += 1;
    await challenge.save();

    // Trigger solution evaluation (async)
    // This should be handled by a separate service
    res.json({
      success: true,
      message: 'Solution submitted successfully',
      solution
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's solutions for a challenge
router.get('/:id/my-solutions', auth, async (req, res) => {
  try {
    const solutions = await Solution.find({
      challenge: req.params.id,
      user: req.user._id
    }).sort('-submittedAt');

    res.json({
      success: true,
      solutions
    });
  } catch (error) {
    console.error('Get solutions error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
