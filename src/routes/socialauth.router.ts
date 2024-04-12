import { Router } from 'express';
import { socialAuthControllers } from '../controllers';
import { googleAuthenticate, googleCallback } from '../services';

const router = Router();

// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
// router.get('/auth/google/redirect', passport.authenticate('google', {
//     session: false,
//     failureRedirect: BASE_APP_URL
// }), googleRedirect);

router.get("/google/login/success", socialAuthControllers.googleLogin);
router.get("/google/login/failed", socialAuthControllers.googleLoginFailed);
router.get("/google/auth", googleAuthenticate);
router.get("/google/auth/callback", googleCallback);
router.get("/google/auth/redirect", googleCallback);
router.get("/google/auth/logout", socialAuthControllers.googleLogout)
// http://localhost:3001/api/v1/socialauth/google/auth

export default router;



