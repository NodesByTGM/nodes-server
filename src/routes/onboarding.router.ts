import { Router } from 'express';
import { onboardingControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.post('/', AuthMiddlewares.isAuthenticated, onboardingControllers.onboarding);
router.post('/talent', AuthMiddlewares.isAuthenticated, onboardingControllers.talentOnboarding);
router.post('/business', AuthMiddlewares.isBusinessAccount, onboardingControllers.businessOnboarding);
router.post('/verify-business', AuthMiddlewares.isBusinessAccount, onboardingControllers.verifyBusiness);

export default router;