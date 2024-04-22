import { Router } from 'express';
import { adminControllers } from '../controllers';
import { authenticateAdmin, authenticateSuperAdmin } from '../middlewares';

const router = Router();

router.get('/users', authenticateAdmin, adminControllers.getAllUsers);
router.get('/members', authenticateAdmin, adminControllers.getAllMembers);
router.get('/subscriptions', authenticateSuperAdmin, adminControllers.getSubscriptions);

export default router;