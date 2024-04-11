import { Router } from 'express';
import { eventControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, eventControllers.createEvent);
router.get('/', authenticate, eventControllers.getEvents);
router.get('/saved', authenticate, eventControllers.getSavedEvents);
router.get('/mine', authenticate, eventControllers.getMyEvents);
router.get('/:id', authenticate, eventControllers.getEvent);
router.put('/:id', authenticate, eventControllers.updateEvent);
router.delete('/:id', authenticate, eventControllers.deleteEvent);
router.post('/save/:id', authenticate, eventControllers.saveEvent);
router.post('/unsave/:id', authenticate, eventControllers.unsaveEvent);


export default router;