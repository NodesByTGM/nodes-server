import { Router } from 'express';
import {projectControllers} from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/', AuthMiddlewares.isAuthenticated, projectControllers.getProjects);
router.post('/', AuthMiddlewares.isAuthenticated, projectControllers.createProject);
router.get('/mine', AuthMiddlewares.isAuthenticated, projectControllers.getMyProjects);


export default router;