const express = require('express');
const router = express.Router();
const Solution = require('../models/Solution');
const Challenge = require('../models/Challenge');
const auth = require('../middleware/auth');
const { executeCodeFr } = require('../utils/codeRunner');

// Get solution by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('challenge', 'title difficulty category')
      .populate('user', 'username');

    if (!solution) {
      return res.status(404).json({
        success: false,
        error: 'Solution not found'
      });
    }

    // Only allow access to solution owner or challenge author
    const challenge = await Challenge.findById(solution.challenge._id);
    if (!solution.user._id.equals(req.user._id) && !challenge.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this solution'
      });
    }

    res.json({
      success: true,
      solution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all solutions for a challenge (admin only)
router.get('/challenge/:challengeId', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Only allow challenge author to view all solutions
    if (!challenge.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view all solutions'
      });
    }

    const solutions = await Solution.find({ challenge: req.params.challengeId })
      .populate('user', 'username')
      .sort('-score');

    res.json({
      success: true,
      solutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's solutions for a challenge
router.get('/challenge/:challengeId/my', auth, async (req, res) => {
  try {
    const solutions = await Solution.find({
      challenge: req.params.challengeId,
      user: req.user._id
    }).sort('-submittedAt');

    res.json({
      success: true,
      solutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Submit a solution
router.post('/challenge/:challengeId', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    const { code } = req.body;
    
    // Create a new solution
    const solution = new Solution({
      challenge: challenge._id,
      user: req.user._id,
      code,
      language: 'codefr',
      status: 'running',
      executionStats: {
        totalTests: challenge.testCases.length
      }
    });

    await solution.save();

    // Execute test cases
    const testResults = [];
    let passedTests = 0;
    let totalTime = 0;
    let maxMemory = 0;

    for (const testCase of challenge.testCases) {
      try {
        const result = await executeCodeFr(code, testCase.input, {
          timeLimit: challenge.timeLimit,
          memoryLimit: challenge.memoryLimit
        });

        const passed = result.output.trim() === testCase.expectedOutput.trim();
        if (passed) passedTests++;

        testResults.push({
          testCase: testCase._id,
          passed,
          output: result.output,
          executionTime: result.executionTime,
          memoryUsed: result.memoryUsed
        });

        totalTime += result.executionTime;
        maxMemory = Math.max(maxMemory, result.memoryUsed);
      } catch (error) {
        testResults.push({
          testCase: testCase._id,
          passed: false,
          error: error.message
        });
      }
    }

    // Update solution with results
    solution.testResults = testResults;
    solution.executionStats = {
      totalTime,
      maxMemory,
      passedTests,
      totalTests: challenge.testCases.length
    };
    solution.score = (passedTests / challenge.testCases.length) * 100;
    solution.status = passedTests === challenge.testCases.length ? 'accepted' : 'wrong_answer';

    await solution.save();

    // Update challenge statistics
    challenge.statistics.totalAttempts++;
    if (solution.status === 'accepted') {
      challenge.statistics.successfulAttempts++;
    }
    challenge.statistics.averageScore = (
      (challenge.statistics.averageScore * (challenge.statistics.totalAttempts - 1) + solution.score) /
      challenge.statistics.totalAttempts
    );
    await challenge.save();

    res.json({
      success: true,
      solution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
