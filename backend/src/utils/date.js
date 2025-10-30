const moment = require('moment');

const formatTimeSpent = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const getRelativeTime = (date) => {
  return moment(date).fromNow();
};

module.exports = {
  formatTimeSpent,
  getRelativeTime,
};

