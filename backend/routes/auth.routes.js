const express = require('express');
const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken);

router.get('/logout', authMiddleware, controller.logout);
router.get('/me', authMiddleware, controller.getCurrentUser);

router.get('/google', controller.startGoogleAuth);
router.get('/google/callback', controller.handleGoogleCallback);

router.get('/github', controller.startGithubAuth);
router.get('/github/callback', controller.handleGithubCallback);

module.exports = router;
