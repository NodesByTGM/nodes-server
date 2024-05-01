import { Router } from 'express';
import { notificationControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/mine', AuthMiddlewares.isAuthenticated, notificationControllers.getMyNotifications);
router.delete('/remove/:id', AuthMiddlewares.isAuthenticated, notificationControllers.removeNotification);

export default router;