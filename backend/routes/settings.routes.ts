import express from 'express';
import * as controller from '../controllers/settings.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.delete('/deleteAccount', authMiddleware, controller.deleteUserAccount);
router.post('/change-password', authMiddleware, controller.changePassword);

export default router;
