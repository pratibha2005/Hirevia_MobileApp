import { Router } from 'express';
import { getProfile, login, registerApplicant, registerHR, updateProfile } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';
import { uploadResume, handleMulterError } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/register/applicant', uploadResume.single('resume'), handleMulterError, registerApplicant);
router.post('/register/hr', registerHR);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
