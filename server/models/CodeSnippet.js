const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  code: {
    type: String,
    required: [true, 'Code content is required'],
    maxlength: [50000, 'Code cannot exceed 50000 characters']
  },
  language: {
    type: String,
    default: 'codefr',
    enum: ['codefr'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  forks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodeSnippet'
  }],
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodeSnippet'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for star count
codeSnippetSchema.virtual('starCount').get(function() {
  return this.stars.length;
});

// Virtual for fork count
codeSnippetSchema.virtual('forkCount').get(function() {
  return this.forks.length;
});

// Index for searching
codeSnippetSchema.index({ title: 'text', description: 'text', tags: 'text' });

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

module.exports = CodeSnippet;
