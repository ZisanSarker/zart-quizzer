const express = require('express');
const router = express.Router();
const {
  generateQuiz,
  getAllQuizzes,
  submitQuiz,
  getRecentQuizAttempts,
  getRecommendedQuizzes,
  getSavedQuizzes,
  getUserQuizzes,
  getQuizAttemptById,
  saveQuiz,
  unsaveQuiz
} = require('../controllers/quiz.controller');

router.post('/generate', generateQuiz);
router.post('/submit', submitQuiz);
router.post('/save', saveQuiz);
router.post('/unsave', unsaveQuiz);

router.get('/recent', getRecentQuizAttempts);
router.get('/recommended', getRecommendedQuizzes);
router.get('/saved', getSavedQuizzes);
router.get('/user/:userId', getUserQuizzes);
router.get('/quiz-attempts/:id', getQuizAttemptById);

module.exports = router;