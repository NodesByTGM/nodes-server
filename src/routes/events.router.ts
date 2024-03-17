import { Router } from 'express';
import {
    eventCreateController,
    eventUpdateController,
    deleteEventController,
    saveEventController,
    getEventsController,
    getEventController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, eventCreateController);
router.get('/', authenticate, getEventsController);
router.get('/:id', authenticate, getEventController);
router.put('/:id', authenticate, eventUpdateController);
router.delete('/:id', authenticate, deleteEventController);
router.post('/save/:id', authenticate, saveEventController);


export default router;