import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AccountModel } from '../mongodb/models';
import { BASE_API_ENDPOINT, SOCIAL_AUTH_GOOGLE_CALLBACK_URL } from '../utilities/config';
import { generateAccessToken } from './auth.service';

passport.use(new Strategy({
    callbackURL: SOCIAL_AUTH_GOOGLE_CALLBACK_URL,  //same URI as registered in Google console portal
    clientID: `${process.env.GOOGLE_CLIENT_ID}`, //replace with copied value from Google console
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    scope: ["profile", "email"],
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const profileData = profile._json
            let user: any = await AccountModel.findOne({ email: profileData.email })
            let redirect_url = "";
            if (!user) {
                user = await AccountModel.create({
                    email: profileData.email,
                    name: profileData.family_name,
                    verified: profileData.email_verified,
                    username: profile.username,
                    avatar: profile.photos ? { id: `${profile.username}-google-avatar`, url: profile.photos[0].value } : null
                })
                // redirect_url = `${BASE_APP_URL}`;  // fallback page
                // return done(null, redirect_url);
                return done(null, user)
            }
            // const token = generateAccessToken(user); //generating token
            // redirect_url = `${BASE_APP_URL}/${token}` //registered on FE for auto-login
            // return done(null, redirect_url);  //redirect_url will get appended to req.user object : passport.js in action
            return done(null, user)

        } catch (error: any) {
            return done(error, false)
        }
    }
));

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((user: any, done) => {
    return done(null, user);
});

export const googleAuthenticate = passport.authenticate('google', { scope: ['profile', 'email'] })

export const googleCallback = passport.authenticate("google", {
    // session: false,
    successRedirect: `${BASE_API_ENDPOINT}/socialauth/google/login/success`,
    failureRedirect: `${BASE_API_ENDPOINT}/socialauth/google/login/failed`
})

export const googleRedirect = (req: any, res: any) => {
    const accessToken = generateAccessToken(req?.user); //generating token
    res.cookie('nodesToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // Outpost: 86400000
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'development' ? false : true,
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN,
        path: '/',
    });
    res.redirect(req?.user); //req.user has the redirection_url
}