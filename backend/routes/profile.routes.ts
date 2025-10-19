import express from 'express';
import * as profileController from '../controllers/profile.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/me', authMiddleware, profileController.updateMyProfile);

router.get('/:userId', profileController.getUserProfile);

export default router;
