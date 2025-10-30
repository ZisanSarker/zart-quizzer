const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/quiz/:quizId', ratingController.getRating);
router.get('/quiz/:quizId/stats', authMiddleware, ratingController.getRatingStats);
router.post('/quiz/:quizId', authMiddleware, ratingController.rateQuiz);
router.post('/multiple', authMiddleware, ratingController.getMultipleQuizRatings);

module.exports = router;

