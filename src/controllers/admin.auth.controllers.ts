import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RequestHandler } from 'express';
import Joi from 'joi';
import { AdminModel, OTPModel, TokenModel } from '../mongodb/models';
import { EmailService, constructResponse, generateAccessToken, generateRefreshToken } from '../services';
import { verifyRefreshToken } from '../services/auth.service';
import { generateOTP, generateRandomPassword } from '../utilities/common';
import { AppConfig, BASE_ADMIN_APP_URL, BASE_APP_URL } from '../utilities/config';
import { loginSchema, registerSchema } from '../validations';
import { emailSchema, sendOTPSchema, usernameSchema, verifyEmailSchema, verifyOTPSchema } from '../validations/auth.validations';

const inviteAdmin: RequestHandler = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return constructResponse({
            res,
            code: 400,
            message: error.details[0].message,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    };

    const {
        name,
        username,
        email,
    } = req.body;
    try {
        const existing = await AdminModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.UserAlreadyExists,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        const existing1 = await AdminModel.findOne({ username: username.toLowerCase() });

        if (existing1) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.UserAlreadyExistsUsername,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }
        const password = generateRandomPassword()
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new AdminModel({
            name,
            username,
            role: AppConfig.ADMIN_ROLES.MEMBER,
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        await user.save();

        EmailService.sendEmail(
            user.email,
            'Admin Invitation',
            `Hello, you've been invited as a member to the Nodes Team, please log into ${BASE_ADMIN_APP_URL} using the following details:\n\n
            Username: ${user.username} \n
            Email: ${user.email} \n
            Password: ${user.password} \n`)

        const data = { invited: user }
        return constructResponse({
            res,
            data,
            code: 201,
            message: AppConfig.STRINGS.InvitedUser,
            apiObject: AppConfig.API_OBJECTS.Admin
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

const login: RequestHandler = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return constructResponse({
            res,
            code: 400,
            message: error.details[0].message,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    };


    const { email = '', username = '', password } = req.body;
    try {
        const user = await AdminModel.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase(), }
            ]
        });

        if (!user) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie('nodesAdminToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // Outpost: 86400000
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'development' ? false : true,
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN,
            path: '/',
        });
        const data = { user, accessToken, refreshToken }
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.LoginSuccessful,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

// Route to refresh access token using the refresh token
const refreshToken: RequestHandler = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        const decodedToken: any = verifyRefreshToken(refreshToken);
        const user: any = await AdminModel.findById(decodedToken?.accountId);
        if (!user) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        const data = { accessToken, refreshToken: newRefreshToken };

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.LoginSuccessful,
            apiObject: AppConfig.API_OBJECTS.Auth
        })

    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Token
        })
    }
};

// TODO: restrict otp sending too many times here too
const sendOtp: RequestHandler = async (req: any, res) => {

    const { error } = sendOTPSchema.validate(req.body);
    if (error) {
        return constructResponse({
            res,
            code: 400,
            message: error.details[0].message,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    };
    // const { email, name, password } = req.body;
    const { email } = req.body;
    try {
        // const user = await AdminModel.findById(accountId);

        // if (!user) {
        //     return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.NotFoundError });
        // }
        // const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // if (!isPasswordCorrect) {
        //     return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
        // }


        // const pastOTP = await OTPModel.findOne({ account: req.user.id, used: false })

        // if (pastOTP) {
        //     await pastOTP.deleteOne()
        // }

        const otp = generateOTP()
        const created = await OTPModel.create({
            email,
            password: otp
        })
        EmailService.sendEmail(email,
            'Email Verification',
            `Please use this OTP For your verification: ${created.password}. Please note this is only valid for 1 hour.`
        )
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.EmailVerificationSent,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

const verifyEmail: RequestHandler = async (req: any, res) => {

    const { error } = verifyEmailSchema.validate(req.body);
    if (error) {
        return constructResponse({
            res,
            code: 400,
            message: error.details[0].message,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    };

    const { otp } = req.body;
    try {
        const dbOTP = await OTPModel.findOne({ email: req.user.email, password: otp, used: false })

        if (!dbOTP) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.InvalidOTPProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        await dbOTP.deleteOne()

        const user = req.user
        user.verified = true
        await user.save()

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.EmailVerified,
            apiObject: AppConfig.API_OBJECTS.Auth
        })

    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

const verifyOtp: RequestHandler = async (req: any, res) => {

    const { error } = verifyOTPSchema.validate(req.body);
    if (error) {
        return constructResponse({
            res,
            code: 400,
            message: error.details[0].message,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    };

    const { otp, email } = req.body;
    try {
        const dbOTP = await OTPModel.findOne({ email: email, password: otp, used: false })

        if (!dbOTP) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.InvalidOTPProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }
        await dbOTP.deleteOne()

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.OTPVerified,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

const forgotPassword: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await AdminModel.findOne({ email });
        if (!user) {
            // TODO: Change this to be if an email exist, we'll send it to you.
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        let token = await TokenModel.findOne({ account: user._id });
        if (!token) {
            token = await TokenModel.create({
                account: user._id,
                token: crypto.randomBytes(32).toString('hex'),
            });
        }

        const link = `${BASE_APP_URL}/auth/reset-password/${user._id}/${token.token}`;
        // console.log(link);

        // TODO: Customize email sent
        EmailService.sendEmail(user.email, AppConfig.STRINGS.PasswordLinkEmailTitle, link);

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.PasswordLinkSent,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        console.error(error);
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }


}

const checkResetLink: RequestHandler = async (req, res) => {
    try {
        const user = await AdminModel.findById(req.params.accountId);
        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        };

        const token = await TokenModel.findOne({
            account: req.params.accountId,
            token: req.params.token,
        });
        if (!token) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        };

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        console.error(error);
        // If an error occurs, send an error response
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
}

const resetPassword: RequestHandler = async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) {

            return constructResponse({
                res,
                code: 400,
                message: error.details[0].message,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        };

        const user = await AdminModel.findById(req.params.accountId);
        if (!user) {

            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        };

        const token = await TokenModel.findOne({
            account: req.params.accountId,
            token: req.params.token,
        });
        if (!token) {

            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        };

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();
        await token.deleteOne();
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.PasswordResetSuccessful,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        console.error(error);
        // If an error occurs, send an error response

        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
}

const changePassword: RequestHandler = async (req: any, res) => {
    try {
        const { password, newPassword } = req.body;
        const accountId = req.user.id; // Assuming you have user data in the request

        // Retrieve the user from the database
        const user = await AdminModel.findById(accountId);

        if (!user) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.AuthenticationError,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        // Check if the current password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {

            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save();

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.PasswordChangeSuccessful,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        console.error(error);
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

const logout: RequestHandler = async (req: any, res, next) => {

    try {
        const user = await AdminModel.findById(req.user.id);
        if (!user) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }
        res.clearCookie('nodesAdminToken')

        return constructResponse({
            res,
            code: 200,
            message: 'Logged out successfully!',
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    } catch (error) {
        console.error(error);
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

const checkEmailExists: RequestHandler = async (req: any, res) => {
    const { error } = emailSchema.validate(req.body);
    if (error) {
        return constructResponse({
            res,
            code: 400,
            message: error.details[0].message,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    };

    const { email } = req.body;
    try {
        const existing = await AdminModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UserAlreadyExists });
        }
        return res.status(200).json({ message: AppConfig.STRINGS.EmailVerified });
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

const checkUsernameExists: RequestHandler = async (req: any, res) => {
    const { error } = usernameSchema.validate(req.body);
    if (error) {
        return constructResponse({
            res,
            code: 400,
            message: error.details[0].message,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    };

    const { username } = req.body;
    try {
        const existing = await AdminModel.findOne({ username: username.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UserAlreadyExistsUsername });
        }
        return res.status(200).json({ message: AppConfig.STRINGS.UsernameVerified });
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

export default {
    inviteAdmin,
    login,
    refreshToken,
    sendOtp,
    verifyEmail,
    verifyOtp,
    forgotPassword,
    checkResetLink,
    resetPassword,
    changePassword,
    logout,
    checkEmailExists,
    checkUsernameExists
}