const express = require('express');
const router = express.Router();
const { getUserStats } = require('../controllers/statistics.controller');

router.get('/me', getUserStats);
router.get('/:userId', getUserStats);

module.exports = router;