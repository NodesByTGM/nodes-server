import { Router } from 'express';
import { eventControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.post('/', AuthMiddlewares.isBusinessAccount, eventControllers.createEvent);
router.get('/', AuthMiddlewares.isAuthenticated, eventControllers.getEvents);
router.get('/saved', AuthMiddlewares.isAuthenticated, eventControllers.getSavedEvents);
router.get('/mine', AuthMiddlewares.isAuthenticated, eventControllers.getMyEvents);
router.get('/:id', AuthMiddlewares.isAuthenticated, eventControllers.getEvent);
router.put('/:id', AuthMiddlewares.isBusinessAccount, eventControllers.updateEvent);
router.delete('/:id', AuthMiddlewares.isAuthenticated, eventControllers.deleteEvent);
router.post('/save/:id', AuthMiddlewares.isAuthenticated, eventControllers.saveEvent);
router.post('/unsave/:id', AuthMiddlewares.isAuthenticated, eventControllers.unsaveEvent);


export default router;