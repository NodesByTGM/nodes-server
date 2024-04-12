import { RequestHandler } from "express";
import { AccountModel } from "../mongodb/models";
import { constructResponse, generateAccessToken, generateRefreshToken } from "../services";
import { AppConfig, BASE_APP_URL } from "../utilities/config";

const googleLogin: RequestHandler = (req: any, res) => {
    try {
        if (req.user) {
            const user = req.user
            if (user) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                res.cookie('nodesToken', accessToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // Outpost: 86400000
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN,
                    path: '/',
                });
                const data = { user, accessToken, refreshToken }
                // return constructResponse({
                //     res,
                //     data,
                //     code: 200,
                //     message: AppConfig.STRINGS.LoginSuccessful,
                //     apiObject: AppConfig.API_OBJECTS.Auth
                // })
                return res.redirect(`${BASE_APP_URL}/socialauth/google?accessToken=${accessToken}&refreshToken=${refreshToken}`)
            }
        } else {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.AuthenticationError,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
}

const googleLoginFailed: RequestHandler = async (req, res) => {
    return constructResponse({
        res,
        code: 401,
        message: AppConfig.ERROR_MESSAGES.AuthenticationError,
        apiObject: AppConfig.API_OBJECTS.Auth
    })
}

const googleLogout: RequestHandler = async (req, res, next) => {
    req.logout((err) => {
        console.log("Logged out");
        if (err) return next(err);
    })
    return res.redirect("/");
}

export default {
    googleLogin,
    googleLoginFailed,
    googleLogout
}