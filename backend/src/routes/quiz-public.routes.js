const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/explore', quizController.getPublicQuizzes);
router.get('/trending', quizController.getTrendingQuizzes);
router.get('/popular-search-queries', quizController.getPopularSearchQueries);
router.get('/:id', quizController.getQuizById);

module.exports = router;

