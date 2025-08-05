const express = require('express');
const router = express.Router();
const {
  getPublicQuizzes,
  getQuizById,
  getPopularSearchQueries
} = require('../controllers/quiz.controller');

router.get('/explore', getPublicQuizzes);
router.get('/popular-search-queries', getPopularSearchQueries);
router.get('/:id', getQuizById);

module.exports = router; 