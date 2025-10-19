import express from 'express';
import {
  generateQuiz,
  submitQuiz,
  getRecentQuizAttempts,
  getRecommendedQuizzes,
  getSavedQuizzes,
  getUserQuizzes,
  getQuizAttemptById,
  saveQuiz,
  unsaveQuiz
} from '../controllers/quiz.controller';

const router = express.Router();

router.post('/generate', generateQuiz);
router.post('/submit', submitQuiz);
router.post('/save', saveQuiz);
router.post('/unsave', unsaveQuiz);

router.get('/recent', getRecentQuizAttempts);
router.get('/recommended', getRecommendedQuizzes);
router.get('/saved', getSavedQuizzes);
router.get('/user/:userId', getUserQuizzes);
router.get('/quiz-attempts/:id', getQuizAttemptById);

export default router;
