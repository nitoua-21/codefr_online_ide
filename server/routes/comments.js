const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Challenge = require('../models/Challenge');

// Create a comment
router.post('/challenges/:challengeId/comments', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const comment = new Comment({
      challenge: req.params.challengeId,
      author: req.user._id,
      content: req.body.content
    });

    await comment.save();
    
    // Populate author details before sending response
    await comment.populate('author', 'username');

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
});

// Get comments for a challenge
router.get('/challenges/:challengeId/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ challenge: req.params.challengeId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('author', 'username')
      .exec();

    const total = await Comment.countDocuments({ challenge: req.params.challengeId });

    res.json({
      comments,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Delete a comment
router.delete('/challenges/:challengeId/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is the author or an admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await comment.remove();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

module.exports = router;
