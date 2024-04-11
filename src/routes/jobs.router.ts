import { Router } from 'express';
import { jobControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/', authenticate, jobControllers.createJob);
router.get('/', authenticate, jobControllers.getJobs);
router.get('/saved', authenticate, jobControllers.getSavedJobs);
router.get('/applied', authenticate, jobControllers.getAppliedJobs);
router.get('/mine', authenticate, jobControllers.getMyJobs);
router.get('/:id', authenticate, jobControllers.getJob);
router.put('/:id', authenticate, jobControllers.updateJob);
router.delete('/:id', authenticate, jobControllers.deleteJob);
router.post('/apply/:id', authenticate, jobControllers.applyToJob);
router.post('/save/:id', authenticate, jobControllers.saveJob);
router.post('/unsave/:id', authenticate, jobControllers.unsaveJob);


export default router;