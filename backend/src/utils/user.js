const sanitizeUser = (user) => {
  if (!user) return null;
  const userObj = user.toJSON ? user.toJSON() : user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.passwordChangedAt;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  delete userObj.__v;
  return userObj;
};

const getAuthProvider = (user) => {
  if (user.googleId) return 'google';
  if (user.githubId) return 'github';
  return 'local';
};

module.exports = {
  sanitizeUser,
  getAuthProvider,
};

