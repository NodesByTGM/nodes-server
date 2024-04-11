import { Router } from 'express';
import { onboardingControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, onboardingControllers.onboarding);
router.post('/talent', authenticate, onboardingControllers.talentOnboarding);
router.post('/business', authenticate, onboardingControllers.businessOnboarding);
router.post('/verify-business', authenticate, onboardingControllers.verifyBusiness);

export default router;