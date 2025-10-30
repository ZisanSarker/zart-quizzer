const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/generate', authMiddleware, quizController.generateQuiz);
router.post('/submit', quizController.submitQuiz);
router.post('/save', authMiddleware, quizController.saveQuiz);
router.post('/unsave', authMiddleware, quizController.unsaveQuiz);

router.get('/recent', authMiddleware, quizController.getRecentQuizAttempts);
router.get('/recommended', authMiddleware, quizController.getRecommendedQuizzes);
router.get('/saved', authMiddleware, quizController.getSavedQuizzes);
router.get('/user/:userId', quizController.getUserQuizzes);
router.get('/quiz-attempts/:id', quizController.getQuizAttemptById);

module.exports = router;

