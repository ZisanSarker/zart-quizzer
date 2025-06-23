const mongoose = require('mongoose');

const SocialLinksSchema = new mongoose.Schema({
  twitter: { type: String },
  linkedin: { type: String },
  github: { type: String },
}, { _id: false });

const BadgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  socialLinks: { type: SocialLinksSchema, default: () => ({}) },
  badges: { type: [BadgeSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);