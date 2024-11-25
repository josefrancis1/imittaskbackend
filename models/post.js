// models/Post.js
const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    type: String,
    required: true
  },
  username: {
    type: String,
    trim: true,
  },
  image: {
    url: {
      type: String,
      required: true
    },
   
  },
  description: {
    type: String,
    trim: true,
    maxLength: 2000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ 'comments.user': 1 });
postSchema.index({ tags: 1 });

// Virtual field for likes count
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual field for comments count
postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Method to check if a user has liked the post
postSchema.methods.isLikedByUser = function(userId) {
  return this.likes.includes(userId);
};

// Method to check if a user has saved the post
postSchema.methods.isSavedByUser = function(userId) {
  return this.savedBy.includes(userId);
};

// Pre-save middleware to handle any pre-save operations
postSchema.pre('save', async function(next) {
  // Add any pre-save operations here
  next();
});

// Static method to get posts with user details populated
postSchema.statics.getPostsWithDetails = function() {
  return this.find()
    .populate('user', 'username avatar')
    .populate('comments.user', 'username avatar')
    .sort({ createdAt: -1 });
};

// Configure toJSON method to transform the document when converted to JSON
postSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;