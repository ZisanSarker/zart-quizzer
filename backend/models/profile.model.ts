import mongoose, { Schema } from 'mongoose';
import { IProfile, ISocialLinks, IBadge } from '../types';

const SocialLinksSchema = new Schema<ISocialLinks>({
  twitter: { type: String },
  linkedin: { type: String },
  github: { type: String },
}, { _id: false });

const BadgeSchema = new Schema<IBadge>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  socialLinks: { type: SocialLinksSchema, default: () => ({}) },
  badges: { type: [BadgeSchema], default: [] }
}, { timestamps: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);
