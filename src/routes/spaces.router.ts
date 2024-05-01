import { Router } from 'express';
import { spaceControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/', AuthMiddlewares.isAuthenticated, spaceControllers.getSpaces);
router.get('/mine', AuthMiddlewares.isAuthenticated, spaceControllers.getMySpaces);
router.post('/', AuthMiddlewares.isAuthenticated, spaceControllers.createSpace);
router.put('/:id', AuthMiddlewares.isAuthenticated, spaceControllers.updateSpace);
router.post('/join/:id', AuthMiddlewares.isAuthenticated, spaceControllers.joinSpace);
router.post('/leave/:id', AuthMiddlewares.isAuthenticated, spaceControllers.leaveSpace);
router.post('/add-member/:id', AuthMiddlewares.isAuthenticated, spaceControllers.addMemberToSpace);
router.post('/remove-member/:id', AuthMiddlewares.isAuthenticated, spaceControllers.removeMemberFromSpace);
router.post('/make-admin/:id', AuthMiddlewares.isAuthenticated, spaceControllers.makeSpaceAdmin);


export default router;