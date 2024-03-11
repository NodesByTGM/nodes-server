import { Router } from 'express';
import {
    businessOnboardingController,
    onboardingController,
    talentOnboardingController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, onboardingController);
router.post('/talent', authenticate, talentOnboardingController);
router.post('/business', authenticate, businessOnboardingController);


export default router;