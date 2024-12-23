const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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
  programmingLanguage: {
    type: String,
    default: 'codefr',
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
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodeSnippet'
  },
  forks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodeSnippet'
  }],
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  isSolution: {
    type: Boolean,
    default: false
  },
  stars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt timestamp before saving
codeSnippetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for star count
codeSnippetSchema.virtual('starCount').get(function() {
  return this.stars.length;
});

// Virtual for fork count
codeSnippetSchema.virtual('forkCount').get(function() {
  return this.forks.length;
});

// Add text index for search
codeSnippetSchema.index({ title: 'text', description: 'text', tags: 'text' });

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

module.exports = CodeSnippet;
