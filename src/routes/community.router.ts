import { Router } from 'express';
import {
    getPostsController,
    createPostController,
    likePostController,
    unlikePostController,
    getPostController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/posts', authenticate, getPostsController);
router.post('/posts', authenticate, createPostController);
router.get('/post/:id', authenticate, getPostController);
router.post('/posts/like/:id', authenticate, likePostController);
router.post('/posts/unlike/:id', authenticate, unlikePostController);


export default router;