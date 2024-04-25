import { Router } from 'express';
import { usersControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/', authenticate, usersControllers.getAllUsers);
router.get('/profile', authenticate, usersControllers.getProfile);
router.put('/profile', authenticate, usersControllers.updateProfile);
router.put('/business-profile', authenticate, usersControllers.updateBusinessProfile);

router.get('/connections/requests', authenticate, usersControllers.getConnectionRequests);
router.post('/connections/request/:id', authenticate, usersControllers.requestConnection);
router.post('/connections/requests/accept/:id', authenticate, usersControllers.acceptRequest);
router.post('/connections/requests/reject/:id', authenticate, usersControllers.rejectRequest);
router.post('/connections/requests/abandon/:id', authenticate, usersControllers.abandonRequest);
router.delete('/connections/remove/:id', authenticate, usersControllers.removeConnection);
router.get('/connections/mine', authenticate, usersControllers.getProfileConnections);
router.get('/connections/:id', authenticate, usersControllers.getUserConnections);

router.get('/:id', authenticate, usersControllers.getUserProfile);

export default router;