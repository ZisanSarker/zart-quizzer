const express = require('express');
const router = express.Router();
const {
  getPublicQuizzes,
  getQuizById,
  getPopularSearchQueries,
  getTrendingQuizzes
} = require('../controllers/quiz.controller');

router.get('/explore', getPublicQuizzes);
router.get('/trending', getTrendingQuizzes);
router.get('/popular-search-queries', getPopularSearchQueries);
router.get('/:id', getQuizById);

module.exports = router; 