import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  getRating,
  getRatingStats,
  rateQuiz,
  getMultipleQuizRatings
} from '../controllers/rating.controller';

const router = express.Router();

router.get('/quiz/:quizId', getRating);
router.get('/quiz/:quizId/stats', authMiddleware, getRatingStats);
router.post('/quiz/:quizId', authMiddleware, rateQuiz);
router.post('/multiple', authMiddleware, getMultipleQuizRatings);

export default router;
