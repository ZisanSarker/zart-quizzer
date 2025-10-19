import express from 'express';
import { getUserStats } from '../controllers/statistics.controller';

const router = express.Router();

router.get('/me', getUserStats);
router.get('/:userId', getUserStats);

export default router;
