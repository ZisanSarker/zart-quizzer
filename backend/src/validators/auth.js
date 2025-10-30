const validator = require('validator');
const { ValidationError } = require('../errors');

const validateEmail = (email) => {
  if (!email) {
    throw new ValidationError('Email is required');
  }
  if (!validator.isEmail(email)) {
    throw new ValidationError('Please enter a valid email address');
  }
};

const validatePassword = (password) => {
  if (!password) {
    throw new ValidationError('Password is required');
  }
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }
  if (!/\d/.test(password)) {
    throw new ValidationError('Password must include at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ValidationError('Password must include at least one special character');
  }
};

const validateRegistration = (username, email, password) => {
  if (!username || !email || !password) {
    throw new ValidationError('Please fill in all required fields');
  }
  validateEmail(email);
  validatePassword(password);
  if (username.trim().length < 3) {
    throw new ValidationError('Username must be at least 3 characters long');
  }
};

const validateLogin = (email, password) => {
  if (!email || !password) {
    throw new ValidationError('Please enter both email and password');
  }
  validateEmail(email);
};

const validatePasswordChange = (currentPassword, newPassword, confirmPassword) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new ValidationError('Please provide current and new passwords');
  }
  if (newPassword !== confirmPassword) {
    throw new ValidationError('New passwords do not match');
  }
  validatePassword(newPassword);
};

module.exports = {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validateEmail,
  validatePassword,
};

