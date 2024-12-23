const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  difficulty: {
    type: String,
    enum: ['Facile', 'Moyen', 'Difficile'],
    required: true
  },
  category: {
    type: String,
    enum: ['Algorithmes', 'Structures de données', 'Mathématiques', 'Logique', 'Autres'],
    required: true
  },
  initialCode: {
    type: String,
    required: true
  },
  testCases: [testCaseSchema],
  hints: [{
    type: String
  }],
  solution: {
    type: String,
    required: true
  },
  timeLimit: {
    type: Number,
    default: 300, // 5 minutes in seconds
    min: 60,      // minimum 1 minute
    max: 3600     // maximum 1 hour
  },
  memoryLimit: {
    type: Number,
    default: 128, // 128 MB
    min: 16,      // minimum 16 MB
    max: 512      // maximum 512 MB
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  submissions: {
    type: Number,
    default: 0
  },
  successfulSubmissions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for success rate
challengeSchema.virtual('successRate').get(function() {
  if (this.submissions === 0) return 0;
  return (this.successfulSubmissions / this.submissions * 100).toFixed(2);
});

// Virtual for time estimate based on difficulty
challengeSchema.virtual('timeEstimate').get(function() {
  switch(this.difficulty) {
    case 'Facile':
      return '15-30 min';
    case 'Moyen':
      return '30-60 min';
    case 'Difficile':
      return '60+ min';
    default:
      return 'N/A';
  }
});

// Index for search
challengeSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// Compound index for filtering and sorting
challengeSchema.index({
  isPublished: 1,
  difficulty: 1,
  category: 1,
  points: 1,
  createdAt: -1
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
