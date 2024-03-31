import { Router } from 'express';
import {
    eventCreateController,
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, eventCreateController);


export default router;