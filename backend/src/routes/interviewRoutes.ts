import { Router } from 'express';
import { createInterview, getAvailability, getMyInterviews, listInterviews, updateAvailability, updateInterview } from '../controllers/interviewController';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/my', requireAuth, getMyInterviews);
router.get('/', requireAuth, requireRole(['HR']), listInterviews);
router.post('/', requireAuth, requireRole(['HR']), createInterview);
router.patch('/:id', requireAuth, requireRole(['HR']), updateInterview);

router.get('/availability', requireAuth, requireRole(['HR']), getAvailability);
router.put('/availability', requireAuth, requireRole(['HR']), updateAvailability);

export default router;
