import { Router } from 'express';
import { postControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/', authenticate, postControllers.getPosts);
router.get('/mine', authenticate, postControllers.getMyPosts);
router.post('/', authenticate, postControllers.createPost);
router.get('/:id', authenticate, postControllers.getPost);
router.post('/like/:id', authenticate, postControllers.likePost);
router.post('/unlike/:id', authenticate, postControllers.unlikePost);


export default router;