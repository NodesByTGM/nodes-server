import { Router } from 'express';
import { communityControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/posts', authenticate, communityControllers.getCommunityPosts);
router.post('/posts', authenticate, communityControllers.createCommunityPost);
router.get('/post/:id', authenticate, communityControllers.getCommunityPost);
router.post('/posts/like/:id', authenticate, communityControllers.likeCommunityPost);
router.post('/posts/unlike/:id', authenticate, communityControllers.unlikeCommunityPost);


export default router;