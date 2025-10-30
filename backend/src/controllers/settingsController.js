const settingsService = require('../services/settingsService');
const { validatePasswordChange } = require('../validators/auth');

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    validatePasswordChange(currentPassword, newPassword, confirmPassword);

    await settingsService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await settingsService.deleteUserAccount(userId);

    res.status(200).json({ message: 'Account and all data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  changePassword,
  deleteUserAccount,
};

