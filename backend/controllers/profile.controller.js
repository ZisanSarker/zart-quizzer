const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const UserStats = require('../models/statistics.model');

// GET /api/profile/me
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await Profile.findOne({ userId }).populate(
      'userId',
      'username email profilePicture createdAt'
    );

    if (!profile) {
      profile = await Profile.create({ userId });
      profile = await profile.populate('userId', 'username email profilePicture createdAt');
    }

    const statsDoc = await UserStats.findOne({ userId });
    const stats = statsDoc
      ? {
          quizzesCreated: statsDoc.quizzesCreated,
          quizzesTaken: statsDoc.quizzesCompleted,
          averageScore:
            statsDoc.totalQuestions > 0
              ? Math.round((statsDoc.totalScore / statsDoc.totalQuestions) * 100)
              : 0,
          followers: 0,
          following: 0,
        }
      : {
          quizzesCreated: 0,
          quizzesTaken: 0,
          averageScore: 0,
          followers: 0,
          following: 0,
        };

    const profileData = {
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

    res.status(200).json({ profile: profileData });
  } catch (err) {
    console.error('getMyProfile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile/me
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const allowedFields = ['bio', 'location', 'website', 'socialLinks', 'badges'];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle username update
    if (req.body.username !== undefined && req.body.username.trim() !== "") {
      // Check uniqueness
      const existingUser = await User.findOne({ username: req.body.username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      await User.findByIdAndUpdate(userId, { username: req.body.username });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).populate('userId', 'username email profilePicture createdAt');

    // Get user statistics (if any)
    const statsDoc = await UserStats.findOne({ userId });
    const stats = statsDoc
      ? {
          quizzesCreated: statsDoc.quizzesCreated,
          quizzesTaken: statsDoc.quizzesCompleted,
          averageScore:
            statsDoc.totalQuestions > 0
              ? Math.round((statsDoc.totalScore / statsDoc.totalQuestions) * 100)
              : 0,
          followers: 0,
          following: 0,
        }
      : {
          quizzesCreated: 0,
          quizzesTaken: 0,
          averageScore: 0,
          followers: 0,
          following: 0,
        };

    const profileData = {
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

    res.status(200).json({ profile: profileData });
  } catch (err) {
    console.error('updateMyProfile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};