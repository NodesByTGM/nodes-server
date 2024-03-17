import { Router } from 'express';
import {
    jobCreateController,
    jobUpdateController,
    deleteJobController,
    applyToJobController,
    getJobsController,
    getJobController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, jobCreateController);
router.get('/', authenticate, getJobsController);
router.get('/:id', authenticate, getJobController);
router.put('/:id', authenticate, jobUpdateController);
router.delete('/:id', authenticate, deleteJobController);
router.post('/apply/:id', authenticate, applyToJobController);


export default router;