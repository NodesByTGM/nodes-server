import { Router } from 'express';
import { allUsersContoller, profileController, profileUpdateController } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/profile', authenticate, profileController);
router.put('/profile', authenticate, profileUpdateController);
router.get('/', allUsersContoller);

export default router;