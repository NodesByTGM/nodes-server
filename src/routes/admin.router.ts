import { Router } from 'express';
import { adminControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();


router.get('/users', AuthMiddlewares.isAdmin, adminControllers.getAllUsers);
router.get('/users/:id', AuthMiddlewares.isAdmin, adminControllers.getUserProfile);
router.delete('/users/:id', AuthMiddlewares.isAdmin, adminControllers.deleteUser);
router.get('/members', AuthMiddlewares.isAdmin, adminControllers.getAllMembers);
router.get('/members/:id', AuthMiddlewares.isAdmin, adminControllers.getMemberProfile);
router.get('/subscriptions', AuthMiddlewares.isSuperAdmin, adminControllers.getSubscriptions);
router.post('/verify-business/:id', AuthMiddlewares.isAdmin, adminControllers.verifyBusiness);
router.post('/send-email-to-users', AuthMiddlewares.isSuperAdmin, adminControllers.sendEmailToUsers);

export default router;
