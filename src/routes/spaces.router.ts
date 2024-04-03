import { Router } from 'express';
import { spaceControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/', authenticate, spaceControllers.getSpaces);
router.get('/mine', authenticate, spaceControllers.getMySpaces);
router.post('/', authenticate, spaceControllers.createSpace);
router.put('/:id', authenticate, spaceControllers.updateSpace);
router.post('/join/:id', authenticate, spaceControllers.joinSpace);
router.post('/leave/:id', authenticate, spaceControllers.leaveSpace);
router.post('/add-member/:id', authenticate, spaceControllers.addMemberToSpace);
router.post('/remove-member/:id', authenticate, spaceControllers.removeMemberFromSpace);
router.post('/make-admin/:id', authenticate, spaceControllers.makeSpaceAdmin);


export default router;