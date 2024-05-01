import { Router } from 'express';
import { postControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/', AuthMiddlewares.isAuthenticated, postControllers.getPosts);
router.get('/mine', AuthMiddlewares.isAuthenticated, postControllers.getMyPosts);
router.post('/', AuthMiddlewares.isAuthenticated, postControllers.createPost);
router.get('/:id', AuthMiddlewares.isAuthenticated, postControllers.getPost);
router.post('/like/:id', AuthMiddlewares.isAuthenticated, postControllers.likePost);
router.post('/unlike/:id', AuthMiddlewares.isAuthenticated, postControllers.unlikePost);


export default router;