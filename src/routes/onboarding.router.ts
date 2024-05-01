import { Router } from 'express';
import { onboardingControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.post('/', AuthMiddlewares.isAuthenticated, onboardingControllers.onboarding);
router.post('/talent', AuthMiddlewares.isAuthenticated, onboardingControllers.talentOnboarding);
router.post('/business', AuthMiddlewares.isAuthenticated, onboardingControllers.businessOnboarding);
router.post('/verify-business', AuthMiddlewares.isAuthenticated, onboardingControllers.verifyBusiness);

export default router;