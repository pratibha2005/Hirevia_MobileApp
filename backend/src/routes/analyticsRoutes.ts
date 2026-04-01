import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', requireAuth, requireRole(['HR']), getAnalytics);

export default router;