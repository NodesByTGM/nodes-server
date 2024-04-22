import { Router } from 'express';
import { usersControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/', authenticate, usersControllers.getAllUsers);
router.get('/profile', authenticate, usersControllers.getProfile);
router.put('/profile', authenticate, usersControllers.updateProfile);
router.put('/business-profile', authenticate, usersControllers.updateBusinessProfile);
router.get('/:id', authenticate, usersControllers.getUserProfile);

export default router;