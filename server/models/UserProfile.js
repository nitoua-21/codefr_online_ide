const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  website: {
    type: String,
    maxlength: [200, 'Website URL cannot exceed 200 characters']
  },
  social: {
    github: String,
    twitter: String,
    linkedin: String
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: String,
    location: String,
    from: Date,
    to: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String
  }],
  education: [{
    school: {
      type: String,
      required: true
    },
    degree: String,
    fieldOfStudy: String,
    from: Date,
    to: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String
  }],
  achievements: {
    snippetsCreated: {
      type: Number,
      default: 0
    },
    challengesCompleted: {
      type: Number,
      default: 0
    },
    totalStars: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      enum: ['Novice', 'Intermediate', 'Advanced', 'Expert', 'Master'],
      default: 'Novice'
    }
  }
}, {
  timestamps: true
});

// Update achievements based on activity
userProfileSchema.methods.updateAchievements = async function() {
  const CodeSnippet = mongoose.model('CodeSnippet');
  const Solution = mongoose.model('Solution');

  // Count snippets
  const snippetsCount = await CodeSnippet.countDocuments({ author: this.user });
  
  // Count completed challenges
  const completedChallenges = await Solution.countDocuments({ 
    user: this.user,
    status: 'accepted'
  });

  // Count total stars received
  const snippets = await CodeSnippet.find({ author: this.user });
  const totalStars = snippets.reduce((acc, snippet) => acc + snippet.stars.length, 0);

  // Update achievements
  this.achievements.snippetsCreated = snippetsCount;
  this.achievements.challengesCompleted = completedChallenges;
  this.achievements.totalStars = totalStars;

  // Update rank based on activity
  if (completedChallenges >= 50 && totalStars >= 100) {
    this.achievements.rank = 'Master';
  } else if (completedChallenges >= 30 && totalStars >= 50) {
    this.achievements.rank = 'Expert';
  } else if (completedChallenges >= 15 && totalStars >= 25) {
    this.achievements.rank = 'Advanced';
  } else if (completedChallenges >= 5 && totalStars >= 10) {
    this.achievements.rank = 'Intermediate';
  }

  await this.save();
};

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
