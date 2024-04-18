import { Router } from 'express';
import { communityControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();
router.post('/connect/:accountId', authenticate, communityControllers.connectToUser);
router.post('/connect/:accountId', authenticate, communityControllers.disconnectFromUser);


export default router;