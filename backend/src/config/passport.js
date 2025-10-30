require('dotenv').config();
const passport = require('passport');
const { User } = require('../models');

require('./strategies/google.strategy')(passport);
require('./strategies/github.strategy')(passport);

module.exports = passport;

