import { Router } from 'express';
import {
    getCommunityPostController,
    getCommunityPostsController,
    createCommunityPostController,
    likeCommunityPostController,
    unlikeCommunityPostController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/posts', authenticate, getCommunityPostsController);
router.post('/posts', authenticate, createCommunityPostController);
router.get('/post/:id', authenticate, getCommunityPostController);
router.post('/posts/like/:id', authenticate, likeCommunityPostController);
router.post('/posts/unlike/:id', authenticate, unlikeCommunityPostController);


export default router;