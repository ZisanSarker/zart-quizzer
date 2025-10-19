import express from 'express';
import {
  getPublicQuizzes,
  getQuizById,
  getPopularSearchQueries,
  getTrendingQuizzes
} from '../controllers/quiz.controller';

const router = express.Router();

router.get('/explore', getPublicQuizzes);
router.get('/trending', getTrendingQuizzes);
router.get('/popular-search-queries', getPopularSearchQueries);
router.get('/:id', getQuizById);

export default router;
