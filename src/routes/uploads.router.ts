import { Router } from 'express';
import { uploadControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.post('/media', AuthMiddlewares.isAdminOrUser, uploadControllers.uploadMediaController);
router.delete('/media/delete/:id', AuthMiddlewares.isAdminOrUser, uploadControllers.deleteMediaController);


export default router;