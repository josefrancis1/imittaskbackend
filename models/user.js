// const mongoose = require('mongoose')

// const UserSchema = new mongoose.Schema({
//     name:String,
//     email:String,
//     password:String
// })

// const userModel = mongoose.model("users",UserSchema)
// module.exports = userModel

// models/User.js
const  mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  avatar: {
    url: {
      type: String,
      default: 'default-avatar-url'
    },
  },

}, {
  timestamps: true
});

// // Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// // Virtual field for followers count
// userSchema.virtual('followersCount').get(function() {
//   return this.followers.length;
// });

// // Virtual field for following count
// userSchema.virtual('followingCount').get(function() {
//   return this.following.length;
// });

// // Method to check if this user follows another user
// userSchema.methods.isFollowing = function(userId) {
//   return this.following.includes(userId);
// };

// // Configure toJSON method
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const User =  mongoose.model('User', userSchema);

module.exports = User;