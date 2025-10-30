const { Profile, User, Statistics } = require('../models');
const { NotFoundError } = require('../errors');

const buildProfileStats = (statsDoc) => {
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
    averageScore:
      statsDoc.totalQuestions > 0
        ? Math.round((statsDoc.totalScore / statsDoc.totalQuestions) * 100)
        : 0,
    followers: 0,
    following: 0,
  };
};

const buildProfileData = (profile, stats) => {
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
      profilePicture: profile.userId.profilePicture === 'default.jpg' ? null : profile.userId.profilePicture,
      createdAt: profile.userId.createdAt,
    },
    stats,
  };
};

const getMyProfile = async (userId) => {
  let profile = await Profile.findOne({ userId }).populate(
    'userId',
    'username email profilePicture createdAt'
  );

  if (!profile) {
    profile = await Profile.create({ userId });
    profile = await profile.populate('userId', 'username email profilePicture createdAt');
  }

  const statsDoc = await Statistics.findOne({ userId });
  const stats = buildProfileStats(statsDoc);

  return buildProfileData(profile, stats);
};

const updateMyProfile = async (userId, updateData) => {
  const profileUpdateData = { ...updateData };
  delete profileUpdateData.username;

  if (updateData.username) {
    await User.findByIdAndUpdate(userId, { username: updateData.username });
  }

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: profileUpdateData },
    { new: true, upsert: true, runValidators: true }
  ).populate('userId', 'username email profilePicture createdAt');

  const statsDoc = await Statistics.findOne({ userId });
  const stats = buildProfileStats(statsDoc);

  return buildProfileData(profile, stats);
};

const getUserProfile = async (targetUserId) => {
  const user = await User.findById(targetUserId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  let profile = await Profile.findOne({ userId: targetUserId }).populate(
    'userId',
    'username email profilePicture createdAt'
  );

  if (!profile) {
    profile = await Profile.create({ userId: targetUserId });
    profile = await profile.populate('userId', 'username email profilePicture createdAt');
  }

  const statsDoc = await Statistics.findOne({ userId: targetUserId });
  const stats = buildProfileStats(statsDoc);

  return buildProfileData(profile, stats);
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
};

