const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getRating,
  getRatingStats,
  rateQuiz,
  getMultipleQuizRatings
} = require('../controllers/rating.controller');

router.get('/quiz/:quizId', getRating);
router.get('/quiz/:quizId/stats', authMiddleware, getRatingStats);
router.post('/quiz/:quizId', authMiddleware, rateQuiz);
router.post('/multiple', authMiddleware, getMultipleQuizRatings);

module.exports = router; 