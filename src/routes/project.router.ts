import { Router } from 'express';
import {
    projectCreateController,
    allprojectsController,
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/', authenticate, allprojectsController);
router.post('/', authenticate, projectCreateController);


export default router;