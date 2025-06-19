const express = require('express');
const router = express.Router();
const {generateQuiz, getAllQuizzes, getQuizById, submitQuiz, getRecentQuizAttempts, getRecommendedQuizzes} = require('../controllers/quiz.controller');

router.post('/generate',generateQuiz);

router.get('/', getAllQuizzes);


router.post('/submit', submitQuiz);

router.get('/recent', getRecentQuizAttempts);
router.get('/recommended', getRecommendedQuizzes);

router.get('/:id', getQuizById);
module.exports = router;