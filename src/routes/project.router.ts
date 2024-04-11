import { Router } from 'express';
import {projectControllers} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/', authenticate, projectControllers.getProjects);
router.post('/', authenticate, projectControllers.createProject);
router.get('/mine', authenticate, projectControllers.getMyProjects);


export default router;