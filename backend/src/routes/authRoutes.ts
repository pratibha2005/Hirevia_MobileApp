import { Router } from 'express';
import { getProfile, login, registerApplicant, registerHR, updateProfile } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register/applicant', registerApplicant);
router.post('/register/hr', registerHR);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
