import { Router } from 'express';
import { communityControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();
router.post('/connect/:accountId', AuthMiddlewares.isAuthenticated, communityControllers.connectToUser);
router.post('/connect/:accountId', AuthMiddlewares.isAuthenticated, communityControllers.disconnectFromUser);


export default router;