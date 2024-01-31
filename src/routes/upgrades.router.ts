import { Router } from 'express';
import { businessUpgradeController, talentUpgradeController } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/talent', authenticate, talentUpgradeController);
router.post('/business', authenticate, businessUpgradeController);


export default router;