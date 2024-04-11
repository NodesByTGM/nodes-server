import { Router } from 'express';
import { thirdPartyControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/trending', authenticate, thirdPartyControllers.getNews);


export default router;