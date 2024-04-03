import { Router } from 'express';
import {
    projectCreateController,
    myProjectsController,
    getProjectsController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/', authenticate, getProjectsController);
router.post('/', authenticate, projectCreateController);
router.get('/mine', authenticate, myProjectsController);


export default router;