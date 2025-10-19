import { Request, Response } from 'express';
import Profile from '../models/profile.model';
import User from '../models/user.model';
import UserStats from '../models/statistics.model';

type ProfileUpdateValidation =
  | { valid: true; updateData: any }
  | { valid: false; message: string };

const validateProfileUpdate = (data: any): ProfileUpdateValidation => {
  const allowedFields = ['bio', 'location', 'website', 'socialLinks', 'badges', 'username'];
  const updateData: any = {};
  
  // Validate username if provided
  if (Object.prototype.hasOwnProperty.call(data, 'username')) {
    if (typeof data.username === 'string' && data.username.trim() === '') {
      return { valid: false, message: 'Username cannot be empty' } as const;
    }
  }

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });
  
  return { valid: true, updateData } as const;
};

const buildProfileStats = (statsDoc: any) => {
  if (!statsDoc) {
    return {
      quizzesCreated: 0,
      quizzesTaken: 0,
      averageScore: 0,
      followers: 0,
      following: 0,
    };
  }
  
  return {
    quizzesCreated: statsDoc.quizzesCreated || 0,
    quizzesTaken: statsDoc.quizzesCompleted || 0,
    averageScore: statsDoc.totalQuestions > 0 
      ? Math.round((statsDoc.totalScore / statsDoc.totalQuestions) * 100)
      : 0,
    followers: 0,
    following: 0,
  };
};

const buildProfileData = (profile: any, stats: any) => {
  return {
    _id: profile._id,
    userId: profile.userId._id,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
    socialLinks: profile.socialLinks,
    badges: profile.badges,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    userIdObj: {
      username: profile.userId.username,
      email: profile.userId.email,
      profilePicture: profile.userId.profilePicture,
      createdAt: profile.userId.createdAt,
    },
    stats,
  };
};

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)._id;

    let profile: any = await Profile.findOne({ userId }).populate(
      'userId',
      'username email profilePicture createdAt'
    );

    if (!profile) {
      profile = await Profile.create({ userId });
      profile = await profile.populate('userId', 'username email profilePicture createdAt');
    }

    const statsDoc = await UserStats.findOne({ userId });
    const stats = buildProfileStats(statsDoc);
    const profileData = buildProfileData(profile, stats);

    console.log(`[PROFILE] Profile retrieved for user: ${userId}`);

    res.status(200).json({ 
      message: 'Profile retrieved successfully',
      profile: profileData 
    });
    return;
  } catch (error: any) {
    console.error(`[PROFILE] Get profile error: ${error.message}`);
    res.status(500).json({ message: 'Unable to retrieve profile. Please try again.' });
    return;
  }
};

export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)._id;

    const validation = validateProfileUpdate(req.body);
    if (!validation.valid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const { updateData } = validation;
    const profileUpdateData = { ...updateData };
    delete profileUpdateData.username;

    if (updateData.username) {
      await User.findByIdAndUpdate(userId, { username: updateData.username });
    }

    const profile: any = await Profile.findOneAndUpdate(
      { userId },
      { $set: profileUpdateData },
      { new: true, upsert: true, runValidators: true }
    ).populate('userId', 'username email profilePicture createdAt');

    const statsDoc = await UserStats.findOne({ userId });
    const stats = buildProfileStats(statsDoc);
    const profileData = buildProfileData(profile, stats);

    console.log(`[PROFILE] Profile updated for user: ${userId}`);

    res.status(200).json({ 
      message: 'Profile updated successfully',
      profile: profileData 
    });
    return;
  } catch (error: any) {
    console.error(`[PROFILE] Update profile error: ${error.message}`);
    res.status(500).json({ message: 'Unable to update profile. Please try again.' });
    return;
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params as { userId: string };

    console.log(`[PROFILE] Requesting profile for userId: ${userId}`);

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    let profile: any = await Profile.findOne({ userId }).populate(
      'userId',
      'username email profilePicture createdAt'
    );

    console.log(`[PROFILE] Found profile:`, profile ? 'yes' : 'no');

    if (!profile) {
      console.log(`[PROFILE] Creating default profile for userId: ${userId}`);
      profile = await Profile.create({ userId });
      profile = await profile.populate('userId', 'username email profilePicture createdAt');
    }

    const statsDoc = await UserStats.findOne({ userId });
    console.log(`[PROFILE] Found stats:`, statsDoc ? 'yes' : 'no');
    
    const stats = buildProfileStats(statsDoc);
    const profileData = buildProfileData(profile, stats);

    console.log(`[PROFILE] Profile retrieved for user: ${userId}`);
    console.log(`[PROFILE] Profile data:`, JSON.stringify(profileData, null, 2));

    res.status(200).json({ 
      message: 'Profile retrieved successfully',
      profile: profileData 
    });
    return;
  } catch (error: any) {
    console.error(`[PROFILE] Get user profile error: ${error.message}`);
    console.error(`[PROFILE] Error stack:`, error.stack);
    res.status(500).json({ message: 'Unable to retrieve profile. Please try again.' });
    return;
  }
};
