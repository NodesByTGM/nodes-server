import { Router } from 'express';
import {
    adminAuthControllers
} from '../controllers';
import { AuthMiddlewares } from '../middlewares';

const router = Router();

router.post('/invite-admin', AuthMiddlewares.isAdmin, adminAuthControllers.inviteAdmin);
router.post('/login', adminAuthControllers.login);
router.get('/logout', AuthMiddlewares.isAdmin, adminAuthControllers.logout);
router.post('/reset-password/:accountId/:token', adminAuthControllers.resetPassword);
router.get('/check-reset-link/:accountId/:token', adminAuthControllers.checkResetLink);
router.post('/forgot-password', adminAuthControllers.forgotPassword);
router.post('/change-password', AuthMiddlewares.isAdmin, adminAuthControllers.changePassword);
router.post('/refresh-token', adminAuthControllers.refreshToken)
router.post('/send-otp', adminAuthControllers.sendOtp)
router.post('/verify-otp', adminAuthControllers.verifyOtp)
router.post('/verify-email', AuthMiddlewares.isAdmin, adminAuthControllers.verifyEmail)
router.post('/check-email', AuthMiddlewares.isAdmin, adminAuthControllers.checkEmailExists)
router.post('/check-username', AuthMiddlewares.isAdmin, adminAuthControllers.checkUsernameExists)


export default router;