import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { OTPModel, TokenModel, AccountModel } from '../mongodb/models';
import { generateAccessToken, sendEmail } from '../services';
import { AppConfig } from '../utilities/config';
import { loginSchema, registerSchema } from '../validations';
import { sendOTPSchema, verifyEmailSchema, verifyOTPSchema } from '../validations/auth.validations';
import { generateOTP } from '../utilities/common';

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User Registration
 *     description: Register a new user with the provided information.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The full name of the user.
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 description: The desired username for the user.
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: john@example.com
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the user (in YYYY-MM-DD format).
 *                 example: 1990-01-01
 *               otp:
 *                 type: string
 *                 description: One-time password (optional, used for additional verification).
 *                 example: 123456
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user account.
 *                 example: securePassword123
 *             required:
 *               - name
 *               - username
 *               - email
 *               - dob
 *               - password
 *     responses:
 *       '200':
 *         description: User successfully registered.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '500':
 *         description: Internal Server Error.
 */

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
        if (existing) {
            return res.status(404).json({ message: AppConfig.ERROR_MESSAGES.UserAlreadyExists });
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

        const data = { ...req.body, id: user._id }
        return res.json({ message: AppConfig.STRINGS.RegistrationSuccessful, data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError, error });
    }
};


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with an existing user
 *     description: Authenticate a user and generate an access token, which could be used as a cookie or an authorization header.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *                 example: password123
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: User successfully registered.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '500':
 *         description: Internal Server Error.
 */

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

        return res.status(200).json({ data: user, accessToken });
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

        jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, (err: any, user: any) => {
            if (err) return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.InvalidCredentialsProvided });

            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        });
    } catch (error) {
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

/**
 * @swagger
 * /api/v1/auth/send-otp:
 *   post:
 *     summary: Send OTP via Email
 *     description: Send a one-time password (OTP) to the provided email address for user registration verification.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to which the OTP will be sent.
 *                 example: john@example.com
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: OTP sent successfully.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify Email with OTP
 *     description: Verify the user's email address using the provided OTP (One-Time Password).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to be verified.
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 description: The one-time password (OTP) sent to the user's email address.
 *                 example: 123456
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       '200':
 *         description: Email successfully verified.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '401':
 *         description: Unauthorized. The provided OTP is incorrect.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verify a provided OTP (One-Time Password).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The one-time password (OTP) to be verified.
 *                 example: 123456
 *               email:
 *                 type: string
 *                 description: The email associated with the OTP.
 *                 example: user@example.com
 *             required:
 *               - otp
 *               - email
 *     responses:
 *       '200':
 *         description: OTP successfully verified.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '401':
 *         description: Unauthorized. The provided OTP is incorrect.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Initiate the "Forgot Password" process by sending a reset link to the user's email address.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address for which the password reset link will be sent.
 *                 example: john@example.com
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Password reset link sent successfully.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '404':
 *         description: Not Found. The provided email address does not exist in the system.
 *       '500':
 *         description: Internal Server Error.
 */

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

        const link = `${process.env.BASE_URL}/auth/reset-password/${user._id}/${token.token}`;
        console.log(link);

        // TODO: Customize email sent
        sendEmail(user.email, AppConfig.STRINGS.PasswordLinkEmailTitle, link);

        return res.status(200).json({ message: AppConfig.STRINGS.PasswordLinkSent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: AppConfig.ERROR_MESSAGES.InternalServerError });
    }


}

/**
 * @swagger
 * /api/v1/auth/check-reset-link/{accountId}/{token}:
 *   get:
 *     summary: Check Reset Link
 *     description: Check the validity of the reset link using the provided accountId and token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier associated with the user's account.
 *         example: abc123
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token provided in the reset link.
 *         example: xyz789
 *     responses:
 *       '200':
 *         description: Reset link is valid. Proceed to reset password.
 *       '400':
 *         description: Bad request. Check the path parameters for missing or invalid information.
 *       '401':
 *         description: Unauthorized. The provided token or accountId is incorrect.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /api/v1/reset-password/{accountId}/{token}:
 *   post:
 *     summary: Reset Password
 *     description: Reset the password for the user using the provided accountId and token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier associated with the user's account.
 *         example: abc123
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token provided for password reset.
 *         example: xyz789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user.
 *                 example: newPassword456
 *             required:
 *               - password
 *     responses:
 *       '200':
 *         description: Password successfully reset.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '401':
 *         description: Unauthorized. The provided token or accountId is incorrect.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /api/v1/change-password:
 *   post:
 *     summary: Change Password
 *     description: Change the password for the authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The current password of the user.
 *                 example: currentPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user.
 *                 example: newPassword456
 *             required:
 *               - password
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Password successfully changed.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal Server Error.
 */

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

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Logout
 *     description: Logout the authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully logged out.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal Server Error.
 */

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