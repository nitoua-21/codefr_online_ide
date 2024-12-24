const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Solution = require('../models/Solution');
const Comment = require('../models/Comment');
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

    // Get solutions count and latest solutions
    const solutionsCount = await Solution.countDocuments({ challenge: challenge._id });
    const latestSolutions = await Solution.find({ challenge: challenge._id })
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'username')
      .select('author status createdAt code');

    // Get latest comments
    const latestComments = await Comment.find({ challenge: challenge._id })
      .sort('-createdAt')
      .limit(10)
      .populate('author', 'username')
      .select('author content createdAt likes dislikes');

    res.json({
      challenge: {
        ...challenge.toJSON(),
        solutionsCount,
        latestSolutions,
        latestComments
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

    // Delete all solutions and comments for this challenge
    await Promise.all([
      Solution.deleteMany({ challenge: challenge._id }),
      Comment.deleteMany({ challenge: challenge._id })
    ]);
    
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
      language: req.body.language || 'codefr'
    });

    await solution.save();
    
    res.status(201).json({ solution });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ error: 'Error submitting solution' });
  }
});

// Add a comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const comment = new Comment({
      challenge: challenge._id,
      author: req.user._id,
      content: req.body.content
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username')
      .select('author content createdAt likes dislikes');

    res.status(201).json({ comment: populatedComment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// Like/Unlike a comment
router.post('/:id/comments/:commentId/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const userId = req.user._id;
    const hasLiked = comment.likes.includes(userId);
    const hasDisliked = comment.dislikes.includes(userId);

    if (hasLiked) {
      // Unlike
      comment.likes = comment.likes.filter(id => !id.equals(userId));
    } else {
      // Like and remove dislike if exists
      comment.likes.push(userId);
      if (hasDisliked) {
        comment.dislikes = comment.dislikes.filter(id => !id.equals(userId));
      }
    }

    await comment.save();

    res.json({ 
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      hasLiked: comment.likes.includes(userId),
      hasDisliked: comment.dislikes.includes(userId)
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Error liking comment' });
  }
});

// Dislike/Undislike a comment
router.post('/:id/comments/:commentId/dislike', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const userId = req.user._id;
    const hasLiked = comment.likes.includes(userId);
    const hasDisliked = comment.dislikes.includes(userId);

    if (hasDisliked) {
      // Undislike
      comment.dislikes = comment.dislikes.filter(id => !id.equals(userId));
    } else {
      // Dislike and remove like if exists
      comment.dislikes.push(userId);
      if (hasLiked) {
        comment.likes = comment.likes.filter(id => !id.equals(userId));
      }
    }

    await comment.save();

    res.json({ 
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      hasLiked: comment.likes.includes(userId),
      hasDisliked: comment.dislikes.includes(userId)
    });
  } catch (error) {
    console.error('Dislike comment error:', error);
    res.status(500).json({ error: 'Error disliking comment' });
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