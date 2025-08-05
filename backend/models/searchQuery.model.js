const mongoose = require('mongoose');

const searchQuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  count: {
    type: Number,
    default: 1
  },
  lastSearched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
searchQuerySchema.index({ query: 1 });
searchQuerySchema.index({ count: -1, lastSearched: -1 });

module.exports = mongoose.model('SearchQuery', searchQuerySchema); 