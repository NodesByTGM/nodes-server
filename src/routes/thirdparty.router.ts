import { Router } from 'express';
import { thirdPartyControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/trending', AuthMiddlewares.isAuthenticated, thirdPartyControllers.getNews);
router.get('/movies-and-shows', AuthMiddlewares.isAuthenticated, thirdPartyControllers.getTrendingMedia);


export default router;