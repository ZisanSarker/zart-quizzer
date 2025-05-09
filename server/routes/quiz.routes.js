const express = require('express');
const router = express.Router();
const {generateQuiz, getAllQuizzes, getQuizById, submitQuiz} = require('../controllers/quiz.controller');

router.post('/generate',generateQuiz);

router.get('/', getAllQuizzes);

router.get('/:id', getQuizById);

router.post('/submit', submitQuiz);

module.exports = router;