const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Specific routes first
router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/me', authMiddleware, profileController.updateMyProfile);

// Dynamic routes last
router.get('/:userId', profileController.getUserProfile);

module.exports = router;