import { Router } from 'express';
import { businessOnboardingController, talentOnboardingController } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/talent', authenticate, talentOnboardingController);
router.post('/business', authenticate, businessOnboardingController);


export default router;