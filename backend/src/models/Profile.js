const mongoose = require('mongoose');

const SocialLinksSchema = new mongoose.Schema(
  {
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
  },
  { _id: false }
);

const BadgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { _id: false }
);

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    bio: { type: String, default: '', maxlength: 500 },
    location: { type: String, default: '', maxlength: 100 },
    website: { type: String, default: '', trim: true },
    socialLinks: { type: SocialLinksSchema, default: () => ({}) },
    badges: { type: [BadgeSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', ProfileSchema);

