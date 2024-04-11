import { Router } from 'express';
import { uploadControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/media', authenticate, uploadControllers.uploadMediaController);
router.delete('/media/delete/:id', authenticate, uploadControllers.deleteMediaController);


export default router;