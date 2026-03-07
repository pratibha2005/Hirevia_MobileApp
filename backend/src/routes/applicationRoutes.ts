import { Router } from 'express';
import {
    applyToJob,
    getMyApplications,
    getCompanyApplications,
    getJobApplications,
    updateApplicationStatus
} from '../controllers/applicationController';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { uploadResume, handleMulterError } from '../middlewares/uploadMiddleware';

const router = Router();

// Applicant
router.post('/', requireAuth, requireRole(['APPLICANT']), uploadResume.single('resume'), handleMulterError, applyToJob);
router.get('/my', requireAuth, requireRole(['APPLICANT']), getMyApplications);

// HR
router.get('/company', requireAuth, requireRole(['HR']), getCompanyApplications);
router.get('/job/:jobId', requireAuth, requireRole(['HR']), getJobApplications);
router.patch('/:id/status', requireAuth, requireRole(['HR']), updateApplicationStatus);

export default router;
