const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');
const auth = require('../middleware/auth');

// Create a new code snippet
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, code, tags, isPublic } = req.body;

    const snippet = new CodeSnippet({
      title,
      description,
      code,
      tags: tags || [],
      isPublic: isPublic || false,
      author: req.user._id
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
      .populate('author', 'username')
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CodeSnippet.countDocuments(query);

    res.json({
      success: true,
      snippets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get public snippets error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's snippets
router.get('/my', auth, async (req, res) => {
  try {
    const snippets = await CodeSnippet.find({ author: req.user._id })
      .populate('author', 'username')
      .sort('-createdAt');

    res.json({
      success: true,
      snippets
    });
  } catch (error) {
    console.error('Get user snippets error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get a specific snippet
router.get('/:id', async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id)
      .populate('author', 'username')
      .populate('forkedFrom', 'title author');

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    // Check if snippet is private and user is not the author
    if (!snippet.isPublic && (!req.user || !req.user._id.equals(snippet.author._id))) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      snippet
    });
  } catch (error) {
    console.error('Get snippet error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update a snippet
router.put('/:id', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    // Check ownership
    if (!snippet.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this snippet'
      });
    }

    const { title, description, code, tags, isPublic } = req.body;

    snippet.title = title || snippet.title;
    snippet.description = description || snippet.description;
    snippet.code = code || snippet.code;
    snippet.tags = tags || snippet.tags;
    snippet.isPublic = isPublic !== undefined ? isPublic : snippet.isPublic;

    await snippet.save();
    await snippet.populate('author', 'username');

    res.json({
      success: true,
      snippet
    });
  } catch (error) {
    console.error('Update snippet error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a snippet
router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    // Check ownership
    if (!snippet.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this snippet'
      });
    }

    await snippet.remove();

    res.json({
      success: true,
      message: 'Snippet deleted successfully'
    });
  } catch (error) {
    console.error('Delete snippet error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Star a snippet
router.post('/:id/star', auth, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }

    // Check if user has already starred
    const hasStarred = snippet.stars.includes(req.user._id);

    if (hasStarred) {
      // Remove star
      snippet.stars = snippet.stars.filter(id => !id.equals(req.user._id));
    } else {
      // Add star
      snippet.stars.push(req.user._id);
    }

    await snippet.save();

    res.json({
      success: true,
      message: hasStarred ? 'Snippet unstarred' : 'Snippet starred',
      starCount: snippet.stars.length
    });
  } catch (error) {
    console.error('Star snippet error:', error);
    res.status(500).json({
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

    // Check if snippet is public or user is the author
    if (!originalSnippet.isPublic && !originalSnippet.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Cannot fork private snippets'
      });
    }

    // Create new snippet as fork
    const forkedSnippet = new CodeSnippet({
      title: `${originalSnippet.title} (forked)`,
      description: originalSnippet.description,
      code: originalSnippet.code,
      tags: originalSnippet.tags,
      isPublic: false,
      author: req.user._id,
      forkedFrom: originalSnippet._id
    });

    await forkedSnippet.save();

    // Add fork reference to original snippet
    originalSnippet.forks.push(forkedSnippet._id);
    await originalSnippet.save();

    await forkedSnippet.populate('author', 'username');
    await forkedSnippet.populate('forkedFrom', 'title author');

    res.status(201).json({
      success: true,
      snippet: forkedSnippet
    });
  } catch (error) {
    console.error('Fork snippet error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
