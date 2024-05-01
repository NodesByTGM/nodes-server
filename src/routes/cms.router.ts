import { Router } from 'express';
import { cmsControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/contents', cmsControllers.getAllContents);
router.get('/admin/contents', AuthMiddlewares.isAdmin, cmsControllers.getAllContentsForAdmin);
router.post('/admin/contents', AuthMiddlewares.isAdmin, cmsControllers.createContent);
router.get('/admin/contents/:id', AuthMiddlewares.isAdmin, cmsControllers.getContent);
router.put('/admin/contents/:id', AuthMiddlewares.isAdmin, cmsControllers.updateContent);

export default router;