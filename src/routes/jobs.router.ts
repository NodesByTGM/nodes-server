import { Router } from 'express';
import {
    applyToJobController,
    deleteJobController,
    getAppliedJobsController,
    getJobController,
    getJobsController,
    getMyJobsController,
    getSavedJobsController,
    jobCreateController,
    jobUpdateController,
    saveJobController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, jobCreateController);
router.get('/', authenticate, getJobsController);
router.get('/saved', authenticate, getSavedJobsController);
router.get('/applied', authenticate, getAppliedJobsController);
router.get('/mine', authenticate, getMyJobsController);
router.get('/:id', authenticate, getJobController);
router.put('/:id', authenticate, jobUpdateController);
router.delete('/:id', authenticate, deleteJobController);
router.post('/apply/:id', authenticate, applyToJobController);
router.post('/save/:id', authenticate, saveJobController);


export default router;