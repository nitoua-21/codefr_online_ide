const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');
const auth = require('../middleware/auth');

// Create a new code snippet
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, code, tags, isPublic, programmingLanguage, challenge } = req.body;

    const snippet = new CodeSnippet({
      title,
      description,
      code,
      programmingLanguage: programmingLanguage || 'codefr',
      tags: tags || [],
      isPublic: isPublic || false,
      author: req.user._id,
      challenge: challenge || null,
      isSolution: !!challenge
    });

    await snippet.save();
    await snippet.populate('author', 'username');

    res.status(201).json({
      success: true,
      snippet
    });
  } catch (error) {
    console.error('Create snippet error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all public snippets with pagination and filters
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const tag = req.query.tag;
    const sortBy = req.query.sortBy || '-createdAt';

    const query = { isPublic: true };

    // Add search condition
    if (search) {
      query.$text = { $search: search };
    }

    // Add tag filter
    if (tag) {
      query.tags = tag;
    }

    const snippets = await CodeSnippet.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username')
      .populate('challenge', 'title');

    const total = await CodeSnippet.countDocuments(query);

    res.json({
      success: true,
      snippets,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's snippets
router.get('/my', auth, async (req, res) => {
  try {
    console.log('Getting snippets for user:', req.user._id);
    const snippets = await CodeSnippet.find({ author: req.user._id })
      .sort('-createdAt')
      .populate('author', 'username')
      .populate('challenge', 'title');

    console.log('Found snippets:', snippets);
    res.json({
      success: true,
      snippets
    });
  } catch (error) {
    console.error('Error getting user snippets:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get a single snippet by ID
router.get('/:id', async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id)
      .populate('author', 'username')
      .populate('forkedFrom', 'title author')
      .populate('challenge', 'title')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    res.json({
      success: true,
      snippet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update a snippet
router.put('/:id', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    const { title, description, code, tags, isPublic, programmingLanguage } = req.body;

    snippet.title = title || snippet.title;
    snippet.description = description || snippet.description;
    snippet.code = code || snippet.code;
    snippet.tags = tags || snippet.tags;
    snippet.isPublic = isPublic !== undefined ? isPublic : snippet.isPublic;
    snippet.programmingLanguage = programmingLanguage || snippet.programmingLanguage;

    await snippet.save();
    await snippet.populate('author', 'username');

    res.json({
      success: true,
      snippet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a snippet
router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    res.json({
      success: true,
      message: 'Snippet deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Like a snippet
router.post('/:id/like', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    const liked = snippet.likes.includes(req.user._id);
    
    if (liked) {
      snippet.likes = snippet.likes.filter(id => !id.equals(req.user._id));
    } else {
      snippet.likes.push(req.user._id);
    }

    await snippet.save();

    res.json({
      success: true,
      liked: !liked,
      likeCount: snippet.likes.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add a comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    const comment = {
      author: req.user._id,
      content: req.body.content
    };

    snippet.comments.push(comment);
    await snippet.save();

    // Populate the new comment's author
    const populatedSnippet = await CodeSnippet.findById(snippet._id)
      .populate('comments.author', 'username');

    const newComment = populatedSnippet.comments[populatedSnippet.comments.length - 1];

    res.json({
      success: true,
      comment: newComment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a comment
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    const comment = snippet.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Only allow comment author or snippet author to delete
    if (!comment.author.equals(req.user._id) && !snippet.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    comment.remove();
    await snippet.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Fork a snippet
router.post('/:id/fork', auth, async (req, res) => {
  try {
    const originalSnippet = await CodeSnippet.findById(req.params.id);

    if (!originalSnippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    const forkedSnippet = new CodeSnippet({
      title: `${originalSnippet.title} (forked)`,
      description: originalSnippet.description,
      code: originalSnippet.code,
      tags: originalSnippet.tags,
      programmingLanguage: originalSnippet.programmingLanguage,
      isPublic: false,
      author: req.user._id,
      forkedFrom: originalSnippet._id,
      challenge: originalSnippet.challenge,
      isSolution: originalSnippet.isSolution
    });

    await forkedSnippet.save();
    originalSnippet.forks.push(forkedSnippet._id);
    await originalSnippet.save();

    await forkedSnippet.populate('author', 'username');

    res.json({
      success: true,
      snippet: forkedSnippet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
