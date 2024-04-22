import { Router } from 'express';
import {
    adminAuthControllers
} from '../controllers';
import { authenticateAdmin } from '../middlewares';

const router = Router();

router.post('/invite-user', authenticateAdmin, adminAuthControllers.inviteAdmin);
router.post('/login', adminAuthControllers.login);
router.get('/logout', authenticateAdmin, adminAuthControllers.logout);
router.post('/reset-password/:accountId/:token', adminAuthControllers.resetPassword);
router.get('/check-reset-link/:accountId/:token', adminAuthControllers.checkResetLink);
router.post('/forgot-password', adminAuthControllers.forgotPassword);
router.post('/change-password', authenticateAdmin, adminAuthControllers.changePassword);
router.post('/refresh-token', adminAuthControllers.refreshToken)
router.post('/send-otp', adminAuthControllers.sendOtp)
router.post('/verify-otp', adminAuthControllers.verifyOtp)
router.post('/verify-email', authenticateAdmin, adminAuthControllers.verifyEmail)
router.post('/check-email', authenticateAdmin, adminAuthControllers.checkEmailExists)
router.post('/check-username', authenticateAdmin, adminAuthControllers.checkUsernameExists)


export default router;