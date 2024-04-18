import { Router } from 'express';
import { authControllers } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.get('/logout', authenticate, authControllers.logout);
router.post('/reset-password/:accountId/:token', authControllers.resetPassword);
router.get('/check-reset-link/:accountId/:token', authControllers.checkResetLink);
router.post('/forgot-password', authControllers.forgotPassword);
router.post('/change-password', authenticate, authControllers.changePassword);
router.post('/refresh-token', authControllers.refreshToken)
router.post('/send-otp', authControllers.sendOTP)
router.post('/verify-otp', authControllers.verifyOTP)
router.post('/verify-email', authenticate, authControllers.verifyEmail)
router.post('/check-email', authControllers.checkEmailExists)
router.post('/check-username', authControllers.checkUsernameExists)


export default router;