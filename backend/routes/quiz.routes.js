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
  getUserQuizzes, // <-- ADD THIS
} = require('../controllers/quiz.controller');

router.post('/generate', generateQuiz);

router.get('/', getAllQuizzes);

// Route for quizzes created by a specific user
router.get('/user/:userId', getUserQuizzes); // <-- ADD THIS

router.post('/submit', submitQuiz);

router.get('/recent', getRecentQuizAttempts);
router.get('/recommended', getRecommendedQuizzes);
router.get('/saved', getSavedQuizzes);

router.get('/:id', getQuizById);

module.exports = router;