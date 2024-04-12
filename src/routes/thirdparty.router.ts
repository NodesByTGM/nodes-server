import { Router } from 'express';
import { thirdPartyControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/trending', authenticate, thirdPartyControllers.getNews);
router.get('/movies-and-shows', authenticate, thirdPartyControllers.getTrendingMedia);


export default router;