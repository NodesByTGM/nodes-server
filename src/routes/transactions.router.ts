import { Router } from 'express';
import {
    paystackWebhookController,
    subscribeToPackage,
    verifyInternalTransactionController,
    verifyTransactionController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/verify', verifyTransactionController);
router.get('/verify/internal', authenticate, verifyInternalTransactionController);
router.post('/webhook/paystack', paystackWebhookController);
router.post('/subscription/initiate/', authenticate, subscribeToPackage);
// reference and plankey callback_url, metadata
// add yearly plans

export default router;