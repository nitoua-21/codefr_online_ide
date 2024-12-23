const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Solution = require('../models/Solution');
const auth = require('../middleware/auth');

// Helper function to check if user can manage challenge
const canManageChallenge = (user, challenge) => {
  return user.role === 'admin' || challenge.author.toString() === user._id.toString();
};

// Get all challenges with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      difficulty,
      category,
      search,
      tag,
      sortBy = '-createdAt',
      author
    } = req.query;

    // Build query
    const query = { isPublished: false };
    
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (author) query.author = author;
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sort = {};
    if (sortBy.startsWith('-')) {
      sort[sortBy.substring(1)] = -1;
    } else {
      sort[sortBy] = 1;
    }

    const challenges = await Challenge.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username');

    const total = await Challenge.countDocuments(query);

    res.json({
      challenges,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Error retrieving challenges' });
  }
});

// Get a single challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('author', 'username');

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Get solutions count
    const solutionsCount = await Solution.countDocuments({ challenge: challenge._id });

    // Get latest solutions
    const latestSolutions = await Solution.find({ challenge: challenge._id })
      .sort('-createdAt')
      .limit(5)
      .populate('author', 'username')
      .select('author status createdAt');

    res.json({
      challenge: {
        ...challenge.toJSON(),
        solutionsCount,
        latestSolutions
      }
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Error retrieving challenge' });
  }
});

// Create a new challenge
router.post('/', auth, async (req, res) => {
  try {
    const challenge = new Challenge({
      ...req.body,
      author: req.user._id
    });

    await challenge.save();
    res.status(201).json({ challenge });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Error creating challenge' });
  }
});

// Update a challenge
router.put('/:id', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (!canManageChallenge(req.user, challenge)) {
      return res.status(403).json({ error: 'Not authorized to update this challenge' });
    }

    Object.assign(challenge, req.body);
    await challenge.save();

    res.json({ challenge });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ error: 'Error updating challenge' });
  }
});

// Delete a challenge
router.delete('/:id', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (!canManageChallenge(req.user, challenge)) {
      return res.status(403).json({ error: 'Not authorized to delete this challenge' });
    }

    // Delete all solutions for this challenge
    await Solution.deleteMany({ challenge: challenge._id });
    
    // Delete the challenge
    await challenge.remove();
    
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({ error: 'Error deleting challenge' });
  }
});

// Submit a solution
router.post('/:id/solutions', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const solution = new Solution({
      challenge: challenge._id,
      author: req.user._id,
      code: req.body.code,
      language: req.body.language || 'javascript'
    });

    await solution.save();
    
    res.status(201).json({ solution });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ error: 'Error submitting solution' });
  }
});

// Get user's solutions for a challenge
router.get('/:id/my-solutions', auth, async (req, res) => {
  try {
    const solutions = await Solution.find({
      challenge: req.params.id,
      author: req.user._id
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

// Publish/Unpublish a challenge
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check if user can manage this challenge
    if (!canManageChallenge(req.user, challenge)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to publish/unpublish this challenge'
      });
    }

    challenge.isPublished = !challenge.isPublished;
    await challenge.save();

    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Publish challenge error:', error);
    res.status(500).json({
      success: false,
      error: 'Error publishing/unpublishing challenge'
    });
  }
});

module.exports = router;
