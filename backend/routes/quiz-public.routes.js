const express = require('express');
const router = express.Router();
const {
  getPublicQuizzes,
  getQuizById
} = require('../controllers/quiz.controller');

router.get('/explore', getPublicQuizzes);
router.get('/:id', getQuizById);

module.exports = router; 