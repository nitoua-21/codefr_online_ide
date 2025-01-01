const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, bio, location, github, website } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        bio,
        location,
        github,
        website,
      },
      { new: true, select: '-password' }
    );

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Update password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true, select: '-password' }
    );

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

module.exports = router;
