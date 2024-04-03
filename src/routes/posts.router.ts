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

router.get('/', authenticate, getPostsController);
router.post('/', authenticate, createPostController);
router.get('/:id', authenticate, getPostController);
router.post('/like/:id', authenticate, likePostController);
router.post('/unlike/:id', authenticate, unlikePostController);


export default router;