const profileService = require('../services/profileService');
const { validateProfileUpdate } = require('../validators/profile');

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await profileService.getMyProfile(userId);

    res.status(200).json({
      message: 'Profile retrieved successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = validateProfileUpdate(req.body);

    const profile = await profileService.updateMyProfile(userId, updateData);

    res.status(200).json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const profile = await profileService.getUserProfile(userId);

    res.status(200).json({
      message: 'Profile retrieved successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
};

