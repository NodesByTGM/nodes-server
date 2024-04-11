import { Router } from 'express';
import { usersControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/profile', authenticate, usersControllers.profile);
router.put('/profile', authenticate, usersControllers.updateProfile);
router.get('/', usersControllers.getAllUsers);

export default router;