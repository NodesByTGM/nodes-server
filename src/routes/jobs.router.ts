import { Router } from 'express';
import { jobControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.post('/', AuthMiddlewares.isBusinessAccount, jobControllers.createJob);
router.get('/', AuthMiddlewares.isAuthenticated, jobControllers.getJobs);
router.get('/saved', AuthMiddlewares.isAuthenticated, jobControllers.getSavedJobs);
router.get('/applied', AuthMiddlewares.isAuthenticated, jobControllers.getAppliedJobs);
router.get('/mine', AuthMiddlewares.isAuthenticated, jobControllers.getMyJobs);
router.get('/:id', AuthMiddlewares.isAuthenticated, jobControllers.getJob);
router.put('/:id', AuthMiddlewares.isBusinessAccount, jobControllers.updateJob);
router.delete('/:id', AuthMiddlewares.isAuthenticated, jobControllers.deleteJob);
router.post('/apply/:id', AuthMiddlewares.isAuthenticated, jobControllers.applyToJob);
router.post('/save/:id', AuthMiddlewares.isAuthenticated, jobControllers.saveJob);
router.post('/unsave/:id', AuthMiddlewares.isAuthenticated, jobControllers.unsaveJob);


export default router;