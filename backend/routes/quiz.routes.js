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
  unsaveQuiz,
  rateQuiz,
  getQuizRatings
} = require('../controllers/quiz.controller');

// Quiz generation
router.post('/generate', generateQuiz);

// Quiz attempts & recent/recommended
router.get('/recent', getRecentQuizAttempts);
router.get('/recommended', getRecommendedQuizzes);
router.get('/saved', getSavedQuizzes);

// Quiz explore/public listing
router.get('/explore', getPublicQuizzes);

// User quizzes
router.get('/user/:userId', getUserQuizzes);

// Quiz submission
router.post('/submit', submitQuiz);

// Save/unsave quiz
router.post('/save', saveQuiz);
router.post('/unsave', unsaveQuiz);

// Rating endpoints
router.post('/rate', rateQuiz);
router.get('/:id/ratings', getQuizRatings);

// Quiz attempt by id
router.get('/quiz-attempts/:id', getQuizAttemptById);

// Get quiz by id (must come after all /:id/* endpoints to avoid conflicts)
router.get('/:id', getQuizById);

module.exports = router;