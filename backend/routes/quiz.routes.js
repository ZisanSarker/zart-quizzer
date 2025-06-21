const express = require('express');
const router = express.Router();
const {
  generateQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  getRecentQuizAttempts,
  getRecommendedQuizzes,
  getSavedQuizzes,
  getUserQuizzes,
  getQuizAttemptById,
} = require('../controllers/quiz.controller');

router.post('/generate', generateQuiz);
router.get('/', getAllQuizzes);
router.get('/user/:userId', getUserQuizzes);
router.post('/submit', submitQuiz);
router.get('/recent', getRecentQuizAttempts);
router.get('/recommended', getRecommendedQuizzes);
router.get('/saved', getSavedQuizzes);
router.get('/quiz-attempts/:id', getQuizAttemptById);
router.get('/:id', getQuizById);

module.exports = router;