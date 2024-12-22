const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user._id })
      .populate('user', ['username', 'email']);

    if (!profile) {
      profile = new UserProfile({ user: req.user._id });
      await profile.save();
    }

    await profile.updateAchievements();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user profile by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.params.userId })
      .populate('user', ['username', 'email']);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const {
      bio,
      location,
      website,
      social,
      skills,
      experience,
      education
    } = req.body;

    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new UserProfile({ user: req.user._id });
    }

    // Update fields
    if (bio) profile.bio = bio;
    if (location) profile.location = location;
    if (website) profile.website = website;
    if (social) profile.social = { ...profile.social, ...social };
    if (skills) profile.skills = skills;
    if (experience) profile.experience = experience;
    if (education) profile.education = education;

    await profile.save();
    await profile.updateAchievements();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update profile avatar
router.put('/me/avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        error: 'Avatar URL is required'
      });
    }

    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new UserProfile({ user: req.user._id });
    }

    profile.avatar = avatar;
    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add experience
router.post('/me/experience', auth, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new UserProfile({ user: req.user._id });
    }

    profile.experience.unshift(newExp);
    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete experience
router.delete('/me/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    profile.experience = profile.experience.filter(
      exp => exp._id.toString() !== req.params.exp_id
    );

    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add education
router.post('/me/education', auth, async (req, res) => {
  try {
    const {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description
    };

    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new UserProfile({ user: req.user._id });
    }

    profile.education.unshift(newEdu);
    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete education
router.delete('/me/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    profile.education = profile.education.filter(
      edu => edu._id.toString() !== req.params.edu_id
    );

    await profile.save();

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
