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
  getPublicQuizzes,
  saveQuiz,
  unsaveQuiz
} = require('../controllers/quiz.controller');

router.post('/generate', generateQuiz);
router.get('/recent', getRecentQuizAttempts);
router.get('/recommended', getRecommendedQuizzes);
router.get('/saved', getSavedQuizzes);
router.get('/explore', getPublicQuizzes);
router.get('/user/:userId', getUserQuizzes);
router.post('/submit', submitQuiz);
router.post('/save', saveQuiz);
router.post('/unsave', unsaveQuiz);
router.get('/quiz-attempts/:id', getQuizAttemptById);
router.get('/:id', getQuizById);

module.exports = router;