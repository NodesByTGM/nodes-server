import { Router } from 'express';
import { transactionControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/verify', transactionControllers.verifyPaystackTransaction);
router.get('/verify/internal', authenticate, transactionControllers.verifyInternalTransaction);
router.post('/webhook/paystack', transactionControllers.paystackWebhook);
router.post('/subscription/initiate/', authenticate, transactionControllers.subscribeToPackage);
// reference and plankey callback_url, metadata
// add yearly plans

export default router;