const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

router.get('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);

router.get('/google', authController.startGoogleAuth);
router.get('/google/callback', authController.handleGoogleCallback);

router.get('/github', authController.startGithubAuth);
router.get('/github/callback', authController.handleGithubCallback);

module.exports = router;

