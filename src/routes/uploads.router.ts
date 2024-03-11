import { Router } from 'express';
import { uploadMediaController, deleteMediaController } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/media', authenticate, uploadMediaController);
router.delete('/media/delete/:id', authenticate, deleteMediaController);


export default router;