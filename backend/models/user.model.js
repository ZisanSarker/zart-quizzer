const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: function () {
      return !this.githubId;
    },
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (val) {
        if (!val && this.githubId) return true;
        return validator.isEmail(val);
      },
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.githubId;
    },
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
