import { Router } from 'express';
import { cmsControllers } from '../controllers';
import { authenticateAdmin } from '../middlewares';

const router = Router();

router.get('/contents', cmsControllers.getAllContents);
router.get('/admin/contents', authenticateAdmin, cmsControllers.getAllContentsForAdmin);
router.post('/admin/contents', authenticateAdmin, cmsControllers.createContent);
router.get('/admin/contents/:id', authenticateAdmin, cmsControllers.getContent);
router.put('/admin/contents/:id', authenticateAdmin, cmsControllers.updateContent);

export default router;