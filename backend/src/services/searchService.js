const { SearchQuery } = require('../models');

const trackSearchQuery = async (query) => {
  if (!query || query.trim().length < 2) return;

  const trimmedQuery = query.trim().toLowerCase();

  try {
    await SearchQuery.findOneAndUpdate(
      { query: trimmedQuery },
      {
        $inc: { count: 1 },
        $set: { lastSearched: new Date() },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error tracking search query:', error);
  }
};

const getPopularSearchQueries = async (limit = 10) => {
  const popularQueries = await SearchQuery.find({})
    .sort({ count: -1, lastSearched: -1 })
    .limit(parseInt(limit))
    .select('query count');

  return popularQueries.map((q) => ({
    query: q.query,
    count: q.count,
  }));
};

module.exports = {
  trackSearchQuery,
  getPopularSearchQueries,
};

