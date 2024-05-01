import { Router } from 'express';
import { usersControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/', AuthMiddlewares.isAuthenticated, usersControllers.getAllUsers);
router.get('/discover', AuthMiddlewares.isAuthenticated, usersControllers.discoverUsers);
router.get('/profile', AuthMiddlewares.isAuthenticated, usersControllers.getProfile);
router.put('/profile', AuthMiddlewares.isAuthenticated, usersControllers.updateProfile);
router.put('/business-profile', AuthMiddlewares.isAuthenticated, usersControllers.updateBusinessProfile);

router.get('/connections/requests', AuthMiddlewares.isAuthenticated, usersControllers.getConnectionRequests);
router.post('/connections/request/:id', AuthMiddlewares.isAuthenticated, usersControllers.requestConnection);
router.post('/connections/requests/accept/:id', AuthMiddlewares.isAuthenticated, usersControllers.acceptRequest);
router.post('/connections/requests/reject/:id', AuthMiddlewares.isAuthenticated, usersControllers.rejectRequest);
router.post('/connections/requests/abandon/:id', AuthMiddlewares.isAuthenticated, usersControllers.abandonRequest);
router.delete('/connections/remove/:id', AuthMiddlewares.isAuthenticated, usersControllers.removeConnection);
router.get('/connections/mine', AuthMiddlewares.isAuthenticated, usersControllers.getProfileConnections);
router.get('/connections/:id', AuthMiddlewares.isAuthenticated, usersControllers.getUserConnections);

router.get('/:id', AuthMiddlewares.isAuthenticated, usersControllers.getUserProfile);

export default router;