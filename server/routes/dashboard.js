const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Solution = require('../models/Solution');

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get solved challenges count
    const solvedChallenges = await Solution.countDocuments({
      user: userId,
      status: 'completed'
    });

    // Calculate total points
    const solutions = await Solution.find({ user: userId, status: 'completed' });
    const totalPoints = solutions.reduce((sum, solution) => sum + (solution.score || 0), 0);

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recentSolutions = await Solution.find({
      user: userId,
      status: 'completed',
      createdAt: { $gte: new Date(today - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    let currentStreak = 0;
    let lastDate = today;

    for (const solution of recentSolutions) {
      const solutionDate = new Date(solution.createdAt);
      solutionDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((lastDate - solutionDate) / (24 * 60 * 60 * 1000));
      
      if (diffDays <= 1) {
        currentStreak++;
        lastDate = solutionDate;
      } else {
        break;
      }
    }

    // Calculate rank
    const allUsers = await User.find({});
    const userRanking = allUsers.sort((a, b) => b.totalPoints - a.totalPoints);
    const userRank = userRanking.findIndex(user => user._id.equals(userId)) + 1;
    const rankPercentile = Math.round((1 - userRank / allUsers.length) * 100);

    // Determine rank title
    let rank = 'Débutant';
    if (totalPoints >= 1000) rank = 'Expert';
    else if (totalPoints >= 500) rank = 'Avancé';
    else if (totalPoints >= 100) rank = 'Intermédiaire';

    res.json({
      success: true,
      stats: {
        solvedChallenges,
        totalPoints,
        currentStreak,
        rank,
        rankPercentile
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user statistics'
    });
  }
});

// Get recent activity
router.get('/activity', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const recentSolutions = await Solution.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('challenge', 'title difficulty');

    const activities = recentSolutions.map(solution => ({
      id: solution._id,
      type: 'Solution',
      title: solution.challenge.title,
      description: `Défi ${solution.challenge.difficulty} ${solution.status === 'completed' ? 'complété' : 'tenté'}`,
      date: solution.createdAt
    }));

    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching recent activity'
    });
  }
});

// Get recommended challenges
router.get('/recommended', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's completed challenges
    const completedChallenges = await Solution.find({
      user: userId,
      status: 'completed'
    }).distinct('challenge');

    // Find challenges not completed by user
    const recommendedChallenges = await Challenge.find({
      _id: { $nin: completedChallenges }
    })
      .sort({ difficulty: 1 })
      .limit(5)
      .select('title difficulty description');

    res.json({
      success: true,
      challenges: recommendedChallenges
    });
  } catch (error) {
    console.error('Error fetching recommended challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching recommended challenges'
    });
  }
});

module.exports = router;
