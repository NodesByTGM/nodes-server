import { Router } from 'express';
import { transactionControllers } from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.get('/mine', AuthMiddlewares.isAuthenticated, transactionControllers.getUserTransactions);
router.get('/verify', transactionControllers.verifyPaystackTransaction);
router.get('/verify/internal', AuthMiddlewares.isAuthenticated, transactionControllers.verifyInternalTransaction);
router.post('/webhook/paystack', transactionControllers.paystackWebhook);
router.post('/subscription/initiate/', AuthMiddlewares.isAuthenticated, transactionControllers.subscribeToPackage);
router.post('/subscription/cancel/', AuthMiddlewares.isAuthenticated, transactionControllers.cancelSubscription);
// reference and plankey callback_url, metadata
// add yearly plans

export default router;