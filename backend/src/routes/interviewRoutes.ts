import { Router } from 'express';
import { createInterview, getAvailability, listInterviews, updateAvailability } from '../controllers/interviewController';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', requireAuth, requireRole(['HR']), listInterviews);
router.post('/', requireAuth, requireRole(['HR']), createInterview);

router.get('/availability', requireAuth, requireRole(['HR']), getAvailability);
router.put('/availability', requireAuth, requireRole(['HR']), updateAvailability);

export default router;
