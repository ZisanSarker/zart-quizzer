import express from 'express';
import * as controller from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken);

router.get('/logout', authMiddleware, controller.logout);
router.get('/me', authMiddleware, controller.getCurrentUser);

router.get('/google', controller.startGoogleAuth);
router.get('/google/callback', controller.handleGoogleCallback as any);

router.get('/github', controller.startGithubAuth);
router.get('/github/callback', controller.handleGithubCallback as any);

export default router;
