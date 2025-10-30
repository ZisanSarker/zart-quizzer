const mongoose = require('mongoose');

const SearchQuerySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    count: {
      type: Number,
      default: 1,
      min: 0,
    },
    lastSearched: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

SearchQuerySchema.index({ count: -1, lastSearched: -1 });

module.exports = mongoose.model('SearchQuery', SearchQuerySchema);

