const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['standard', 'admin'],
    default: 'standard'
  },
  points: {
    type: Number,
    default: 0
  },
  solvedChallenges: [{
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    solvedAt: {
      type: Date,
      default: Date.now
    },
    pointsEarned: {
      type: Number,
      required: true
    }
  }],
  name: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    challengeNotifications: {
      type: Boolean,
      default: true
    },
    autoComplete: {
      type: Boolean,
      default: true
    },
    lineNumbers: {
      type: Boolean,
      default: true
    },
    minimap: {
      type: Boolean,
      default: true
    }
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to add points and record solved challenge
userSchema.methods.addChallengePoints = async function(challengeId, points) {
  // Check if challenge already solved
  const alreadySolved = this.solvedChallenges.some(
    solved => solved.challenge.toString() === challengeId.toString()
  );

  if (!alreadySolved) {
    this.points += points;
    this.solvedChallenges.push({
      challenge: challengeId,
      pointsEarned: points
    });
    await this.save();
  }
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
