import { Router } from 'express';
import {
    registerController,
    loginController,
    getTokenController,
    forgotPasswordController,
    resetPasswordController,
    changePasswordController,
    logoutController,
    sendOTPController,
    verifyEmailController,
    checkResetLinkController,
    verifyOTPController,
} from '../controllers/auth.controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/logout', authenticate, logoutController);
router.post('/reset-password/:accountId/:token', resetPasswordController);
router.get('/check-reset-link/:accountId/:token', checkResetLinkController);
router.post('/forgot-password', forgotPasswordController);
router.post('/change-password', authenticate, changePasswordController);
router.post('/token', getTokenController)
router.post('/send-otp', sendOTPController)
router.post('/veirfy-otp', verifyOTPController)
router.post('/verify-email', authenticate, verifyEmailController)


export default router;