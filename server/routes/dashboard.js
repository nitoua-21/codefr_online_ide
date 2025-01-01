const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Solution = require('../models/Solution');

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total solutions
    const totalSolutions = await Solution.countDocuments({ user: userId });
    
    // Get successful solutions
    const successfulSolutions = await Solution.countDocuments({
      user: userId,
      status: 'success'
    });
    
    // Get total points
    const solutions = await Solution.find({ 
      user: userId,
      status: 'success' 
    }).populate('challenge', 'points');
    
    const totalPoints = solutions.reduce((sum, sol) => 
      sum + (sol.challenge?.points || 0), 0);

    // Get solved challenges by difficulty
    const solvedByDifficulty = await Solution.aggregate([
      { $match: { user: userId, status: 'success' } },
      { $lookup: {
          from: 'challenges',
          localField: 'challenge',
          foreignField: '_id',
          as: 'challenge'
        }
      },
      { $unwind: '$challenge' },
      { $group: {
          _id: '$challenge.difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const difficultyStats = {
      'Facile': 0,
      'Moyen': 0,
      'Difficile': 0
    };
    
    solvedByDifficulty.forEach(stat => {
      if (stat._id in difficultyStats) {
        difficultyStats[stat._id] = stat.count;
      }
    });

    res.json({
      success: true,
      stats: {
        totalSolutions,
        successfulSolutions,
        totalPoints,
        successRate: totalSolutions ? 
          ((successfulSolutions / totalSolutions) * 100).toFixed(1) : 0,
        solvedByDifficulty: difficultyStats
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
      .limit(10)
      .populate('challenge', 'title difficulty');

    // Filter out solutions with invalid challenge references
    const validSolutions = recentSolutions.filter(solution => 
      solution.challenge && solution.challenge.title);

    const activities = validSolutions.map(solution => ({
      id: solution._id,
      type: 'solution',
      title: solution.challenge.title,
      description: `Défi ${solution.challenge.difficulty} - ${getStatusText(solution.status)}`,
      date: solution.createdAt,
      status: solution.status
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
      status: 'success'
    }).distinct('challenge');

    // Find challenges not completed by user
    const recommendedChallenges = await Challenge.find({
      _id: { $nin: completedChallenges },
      isPublished: true
    })
      .sort({ difficulty: 1, points: 1 })
      .limit(5)
      .select('title difficulty description points');

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

// Helper function to get status text
function getStatusText(status) {
  switch (status) {
    case 'success':
      return 'Réussi';
    case 'failed':
      return 'Échoué';
    case 'in_progress':
      return 'En cours';
    default:
      return 'Statut inconnu';
  }
}

module.exports = router;
