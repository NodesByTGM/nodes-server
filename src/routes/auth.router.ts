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
    checkEmailExistsController,
    checkUsernameExistsController
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
router.post('/refresh-token', getTokenController)
router.post('/send-otp', sendOTPController)
router.post('/verify-otp', verifyOTPController)
router.post('/verify-email', authenticate, verifyEmailController)
router.post('/check-email', authenticate, checkEmailExistsController)
router.post('/check-username', authenticate, checkUsernameExistsController)


export default router;