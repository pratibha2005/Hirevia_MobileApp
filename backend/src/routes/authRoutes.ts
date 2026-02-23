import { Router } from 'express';
import { registerApplicant, registerHR, login } from '../controllers/authController';

const router = Router();

router.post('/register/applicant', registerApplicant);
router.post('/register/hr', registerHR);
router.post('/login', login);

export default router;
