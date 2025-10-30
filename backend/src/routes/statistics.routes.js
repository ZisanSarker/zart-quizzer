const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, statisticsController.getUserStats);
router.get('/:userId', statisticsController.getUserStats);

module.exports = router;

