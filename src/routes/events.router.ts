import { Router } from 'express';
import {
    eventCreateController,
    eventUpdateController,
    deleteEventController,
    saveEventController,
    getEventsController,
    getEventController,
    getSavedEventsController,
    getMyEventsController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, eventCreateController);
router.get('/', authenticate, getEventsController);
router.get('/saved', authenticate, getSavedEventsController);
router.get('/mine', authenticate, getMyEventsController);
router.get('/:id', authenticate, getEventController);
router.put('/:id', authenticate, eventUpdateController);
router.delete('/:id', authenticate, deleteEventController);
router.post('/save/:id', authenticate, saveEventController);


export default router;