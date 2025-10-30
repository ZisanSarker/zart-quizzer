const { ValidationError } = require('../errors');

const validateProfileUpdate = (data) => {
  const allowedFields = ['bio', 'location', 'website', 'socialLinks', 'badges', 'username'];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      if (field === 'username' && data[field].trim() === '') {
        throw new ValidationError('Username cannot be empty');
      }
      if (field === 'bio' && data[field].length > 500) {
        throw new ValidationError('Bio cannot exceed 500 characters');
      }
      if (field === 'location' && data[field].length > 100) {
        throw new ValidationError('Location cannot exceed 100 characters');
      }
      updateData[field] = data[field];
    }
  });

  return updateData;
};

module.exports = {
  validateProfileUpdate,
};

