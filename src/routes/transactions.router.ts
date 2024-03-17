import { Router } from 'express';
import {
    paystackWebhookController,
    verifyTransactionController,
    subscribeToPackage,
    verifyInternalTransactionController
} from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/verify', verifyTransactionController);
router.get('/verify/internal', authenticate, verifyInternalTransactionController);
router.post('/webhook/paystack', paystackWebhookController);
router.get('/package/subscribe/:planKey', authenticate, subscribeToPackage);

export default router;