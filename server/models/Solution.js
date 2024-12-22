const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testCase: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  output: String,
  error: String,
  executionTime: Number,
  memoryUsed: Number
});

const solutionSchema = new mongoose.Schema({
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['codefr'],
    default: 'codefr',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'accepted', 'wrong_answer', 'time_limit', 'memory_limit', 'runtime_error', 'compilation_error'],
    default: 'pending'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  testResults: [testResultSchema],
  executionStats: {
    totalTime: {
      type: Number,
      default: 0
    },
    maxMemory: {
      type: Number,
      default: 0
    },
    passedTests: {
      type: Number,
      default: 0
    },
    totalTests: {
      type: Number,
      default: 0
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
solutionSchema.index({ challenge: 1, user: 1, status: 1 });

// Virtual for success rate
solutionSchema.virtual('successRate').get(function() {
  if (!this.executionStats.totalTests) return 0;
  return (this.executionStats.passedTests / this.executionStats.totalTests) * 100;
});

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
