import { Router } from 'express';
import { createJob, listJobs, getJobById, getHRJobs, updateJobStatus } from '../controllers/jobController';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

// Public
router.get('/', listJobs);
router.get('/:id', getJobById);

// HR only
router.get('/hr/my', requireAuth, requireRole(['HR']), getHRJobs);
router.post('/', requireAuth, requireRole(['HR']), createJob);
router.patch('/:id/status', requireAuth, requireRole(['HR']), updateJobStatus);

export default router;
