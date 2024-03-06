import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { OTPModel, TokenModel, AccountModel } from '../mongodb/models';
import { generateAccessToken, generateRefreshToken, sendEmail } from '../services';
import { AppConfig, MAIN_APP_URL } from '../utilities/config';
import { loginSchema, registerSchema } from '../validations';
import { sendOTPSchema, verifyEmailSchema, verifyOTPSchema } from '../validations/auth.validations';
import { generateOTP } from '../utilities/common';
import { verifyRefreshToken } from '../services/auth.service';

export const registerController: RequestHandler = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        name,
        username,
        email,
        dob,
        otp,
        password,
    } = req.body;
    try {

        if (otp) {
            const dbOTP = await OTPModel.findOne({ email, password: otp, used: false })
            if (!dbOTP) {
                return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidOTPProvided });
            }
            await dbOTP.deleteOne()
        }

        const existing = await AccountModel.findOne({ email: email.toLowerCase() });
        // const existing = await AccountModel.findOne({
        //     $or: [
        //       { email: email.toLowerCase() },
        //       { username: username.toLowerCase() },
        //     ],
        //   });
        if (existing) {
            return res.status(404).json({ message: AppConfig.ERROR_MESSAGES.UserAlreadyExists });
        }

        const existing1 = await AccountModel.findOne({ username: username.toLowerCase() });

        if (existing1) {
            return res.status(404).json({ message: AppConfig.ERROR_MESSAGES.UserAlreadyExistsUsername });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new AccountModel({
            name,
            username,
            email: email.toLowerCase(),
            dob,
            verified: otp ? true : false,
            password: hashedPassword,
        });
        await user.save();
        console.log('user saved', user)
        // TODO: Remove this.

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // TODO: Refresh Tokens
        res.cookie('nodesToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // Outpost: 86400000
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'development' ? false : true,
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN,
            path: '/',
        });

        const data = { ...user.toJSON(), accessToken, refreshToken }
        return res.json({ message: AppConfig.STRINGS.RegistrationSuccessful, user: data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError, error });
    }
};

export const loginController: RequestHandler = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    try {
        const user = await AccountModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
        }

        const accessToken = generateAccessToken(user);
        // const refreshToken = generateRefreshToken(user);
        // TODO: Refresh Tokens
        res.cookie('nodesToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // Outpost: 86400000
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'development' ? false : true,
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.DOMAIN,
            path: '/',
        });
        const data = { ...user.toJSON(), accessToken }
        return res.status(200).json({ message: 'Login successful', user: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

// Route to refresh access token using the refresh token
export const getTokenController: RequestHandler = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });

        // jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, (err: any, user: any) => {
        //     if (err) return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });

        //     const accessToken = generateAccessToken(user);
        //     res.json({ accessToken });
        // });

        const decodedToken: any = verifyRefreshToken(refreshToken);
        const user: any = await AccountModel.findById(decodedToken?.accountId);
        if (!user) {
            return res.status(404).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        res.json({ accessToken, refreshToken: newRefreshToken });

    } catch (error) {
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
    }
};

// TODO: restrict otp sending too many times here too
export const sendOTPController: RequestHandler = async (req: any, res) => {

    const { error } = sendOTPSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    // const { email, name, password } = req.body;
    const { email } = req.body;
    // const accountId = req.user._id
    try {
        // const user = await AccountModel.findById(accountId);

        // if (!user) {
        //     return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.NotFoundError });
        // }
        // const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // if (!isPasswordCorrect) {
        //     return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
        // }


        // const pastOTP = await OTPModel.findOne({ accountId: req.user.id, used: false })

        // if (pastOTP) {
        //     await pastOTP.deleteOne()
        // }

        const otp = generateOTP()
        const created = await OTPModel.create({
            // accountId,
            email,
            password: otp
        })
        sendEmail(email,
            'Email Verification',
            `Please use this OTP For your verification: ${created.password}. Please note this is only valid for 1 hour.`
        )
        return res.status(200).json({ message: AppConfig.STRINGS.EmailVerificationSent });
    } catch (error) {
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

export const verifyEmailController: RequestHandler = async (req: any, res) => {

    const { error } = verifyEmailSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { otp } = req.body;
    try {
        const dbOTP = await OTPModel.findOne({ email: req.user.email, password: otp, used: false })

        if (!dbOTP) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidOTPProvided });
        }

        await dbOTP.deleteOne()

        const user = req.user
        user.verified = true
        await user.save()

        return res.status(200).json({ message: AppConfig.STRINGS.EmailVerified });
    } catch (error) {
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

export const verifyOTPController: RequestHandler = async (req: any, res) => {

    const { error } = verifyOTPSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { otp, email } = req.body;
    try {
        const dbOTP = await OTPModel.findOne({ email: email, password: otp, used: false })

        if (!dbOTP) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidOTPProvided });
        }
        await dbOTP.deleteOne()
        return res.status(200).json({ message: AppConfig.STRINGS.OTPVerified });
    } catch (error) {
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

export const forgotPasswordController: RequestHandler = async (req, res) => {
    // Generate a unique reset token and store it (e.g., in a database).
    // Send a password reset email with a link containing the reset token.
    // Include a link to your reset password page where users can enter a new password.
    // You can use Nodemailer to send the email.
    try {
        const { email } = req.body;

        const user = await AccountModel.findOne({ email });
        if (!user) {
            // TODO: Change this to be if an email exist, we'll send it to you.
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound });
        }

        let token = await TokenModel.findOne({ accountId: user._id });
        if (!token) {
            token = await TokenModel.create({
                accountId: user._id,
                token: crypto.randomBytes(32).toString('hex'),
            });
        }

        const link = `${MAIN_APP_URL}/auth/reset-password/${user._id}/${token.token}`;
        console.log(link);

        // TODO: Customize email sent
        sendEmail(user.email, AppConfig.STRINGS.PasswordLinkEmailTitle, link);

        return res.status(200).json({ message: AppConfig.STRINGS.PasswordLinkSent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: AppConfig.ERROR_MESSAGES.InternalServerError });
    }


}

export const checkResetLinkController: RequestHandler = async (req, res) => {
    try {
        const user = await AccountModel.findById(req.params.accountId);
        if (!user) return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided });

        const token = await TokenModel.findOne({
            accountId: req.params.accountId,
            token: req.params.token,
        });
        if (!token) return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided });

        return res.status(200).json({ message: AppConfig.STRINGS.Success });
    } catch (error) {
        console.error(error);
        // If an error occurs, send an error response
        return res.status(500).json({ error: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
}

export const resetPasswordController: RequestHandler = async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await AccountModel.findById(req.params.accountId);
        if (!user) return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided });


        const token = await TokenModel.findOne({
            accountId: req.params.accountId,
            token: req.params.token,
        });
        if (!token) return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.InvalidLinkProvided });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();
        await token.deleteOne();

        return res.status(200).json({ message: AppConfig.STRINGS.PasswordResetSuccessful });
    } catch (error) {
        console.error(error);
        // If an error occurs, send an error response
        return res.status(500).json({ error: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
}

export const changePasswordController: RequestHandler = async (req: any, res) => {
    try {
        const { password, newPassword } = req.body;
        const accountId = req.user.id; // Assuming you have user data in the request

        // Retrieve the user from the database
        const user = await AccountModel.findById(accountId);

        if (!user) {
            return res.status(404).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
        }

        // Check if the current password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
        }
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save();

        return res.json({ message: AppConfig.STRINGS.PasswordChangeSuccessful });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

export const logoutController: RequestHandler = async (req: any, res, next) => {

    try {
        const user = await AccountModel.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });
        }
        res.clearCookie('nodesToken')
        return res.status(200).json({ message: 'Logged out successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};