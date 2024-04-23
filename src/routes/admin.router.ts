import { Router } from 'express';
import { adminControllers } from '../controllers';
import { authenticateAdmin, authenticateSuperAdmin } from '../middlewares';

const router = Router();

router.get('/users', authenticateAdmin, adminControllers.getAllUsers);
router.get('/users/:id', authenticateAdmin, adminControllers.getUserProfile);
router.delete('/users/:id', authenticateAdmin, adminControllers.deleteUser);
router.get('/members', authenticateAdmin, adminControllers.getAllMembers);
router.get('/members/:id', authenticateAdmin, adminControllers.getMemberProfile);
router.get('/subscriptions', authenticateSuperAdmin, adminControllers.getSubscriptions);

export default router;
