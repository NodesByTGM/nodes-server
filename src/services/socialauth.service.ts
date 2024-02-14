// import passport from 'passport';
// import { Strategy } from 'passport-google-oauth20';
// import { AccountModel } from '../mongodb/models';
// import { MAIN_APP_SERVER, SOCIAL_AUTH_GOOGLE_URL } from '../utilities/config';
// import { generateAccessToken } from './auth.service';

// passport.use(new Strategy({
//     callbackURL: SOCIAL_AUTH_GOOGLE_URL,  //same URI as registered in Google console portal
//     clientID: `${process.env.GOOGLE_CLIENT_ID}`, //replace with copied value from Google console
//     clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
// },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             let user: any = await AccountModel.find({ email: profile._json.email })
//             if (!user) {
//                 user = await AccountModel.create({
//                     email: profile._json.email,
//                     name: profile._json.family_name,
//                     verified: profile._json.email_verified,
//                     username: profile.username,
//                     avatar: profile.photos ? profile.photos[0].value : ''
//                 })
//             }
//             let redirect_url = "";
//             if (user) {
//                 const token = generateAccessToken(user); //generating token
//                 redirect_url = `${MAIN_APP_SERVER}/${token}` //registered on FE for auto-login
//                 return done(null, redirect_url);  //redirect_url will get appended to req.user object : passport.js in action
//             } else {
//                 redirect_url = `${MAIN_APP_SERVER}`;  // fallback page
//                 return done(null, redirect_url);
//             }
//         } catch (error: any) {
//             done(error)
//         }
//     }
// ));

// export const googleRedirect = (req: any, res: any) => {
//     const accessToken = generateAccessToken(req?.user); //generating token
//     res.cookie('nodesToken', accessToken, {
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000, // Outpost: 86400000
//         sameSite: 'lax',
//         secure: process.env.NODE_ENV === 'development' ? false : true,
//         domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN,
//         path: '/',
//     });
//     res.redirect(req?.user); //req.user has the redirection_url
// }