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
    default: 1000, // in milliseconds
    min: 100,
    max: 10000
  },
  memoryLimit: {
    type: Number,
    default: 256, // in MB
    min: 16,
    max: 512
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    successfulAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for success rate
challengeSchema.virtual('successRate').get(function() {
  if (this.statistics.totalAttempts === 0) return 0;
  return (this.statistics.successfulAttempts / this.statistics.totalAttempts) * 100;
});

// Index for searching
challengeSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
