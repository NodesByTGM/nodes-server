import { Router } from 'express';
import { uploadControllers } from '../controllers';
import { isAdminOrUser } from '../middlewares/auth.middlewares';

const router = Router();

router.post('/media', isAdminOrUser, uploadControllers.uploadMediaController);
router.delete('/media/delete/:id', isAdminOrUser, uploadControllers.deleteMediaController);


export default router;