
import {
    authUserSchema,
    changePasswordRequestSchema,
    constructResponseSchema,
    emailRequestSchema,
    loginRequestSchema,
    refreshTokenRequestSchema,
    resetLinkParameters,
    resetPasswordRequestSchema,
    responseSchema,
    tokensSchema,
    verifyEmailOTPSchema
} from "./common.doc";


const userRegistrationSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'The full name of the user.',
            example: 'John Doe',
        },
        username: {
            type: 'string',
            description: 'The desired username for the user.',
            example: 'john_doe',
        },
        email: {
            type: 'string',
            format: 'email',
            description: 'The email address of the user.',
            example: 'john@example.com',
        },
        dob: {
            type: 'string',
            format: 'date',
            description: 'The date of birth of the user (in YYYY-MM-DD format).',
            example: '1990-01-01',
        },
        otp: {
            type: 'string',
            description: 'One-time password (optional, used for additional verification).',
            example: '123456',
        },
        password: {
            type: 'string',
            format: 'password',
            description: 'The password for the user account.',
            example: 'Password@123',
        },
        firebaseToken: {
            type: 'string',
            description: 'For Notifications',
            example: 'jkbhjvghfdrte546r57t68y79u8',
        },
    },
    required: ['name', 'username', 'email', 'dob', 'password'],
}


export const authSwagger = {
    paths: {
        '/api/v1/auth/register': {
            post: {
                summary: 'User Registration',
                description: 'Register a new user with the provided information.',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: userRegistrationSchema,
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User successfully registered.',
                        content: {
                            'application/json': {
                                schema: constructResponseSchema(authUserSchema),
                            },
                        },
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/login': {
            post: {
                summary: 'Login with an existing user using (email or username) and password',
                description: 'Authenticate a user and generate an access token, which could be used as a cookie or an authorization header.',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: loginRequestSchema
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User successfully logged in.',
                        content: {
                            'application/json': {
                                schema: constructResponseSchema(authUserSchema),
                            },
                        },
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/refresh-token': {
            post: {
                summary: 'Refresh Access Token',
                description: 'Obtain a new access token using a refresh token.',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: refreshTokenRequestSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'New access token obtained successfully.',
                        content: {
                            'application/json': {
                                schema: constructResponseSchema(tokensSchema)
                            },
                        },
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. The provided refresh token is invalid or expired.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/send-otp': {
            post: {
                summary: 'Send OTP via Email',
                description: 'Send a one-time password (OTP) to the provided email address for user registration verification.',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: emailRequestSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'OTP sent successfully.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        '/api/v1/auth/verify-email': {
            post: {
                summary: 'Verify Email with OTP',
                description: 'Verify the user\'s email address using the provided OTP (One-Time Password).',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: verifyEmailOTPSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Email successfully verified.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. The provided OTP is incorrect.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        '/api/v1/auth/check-email': {
            post: {
                summary: 'Check if Email exists already',
                description: 'Check if Email exists already using user\'s email address.',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: emailRequestSchema
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Email successfully verified.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. The provided OTP is incorrect.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/verify-otp': {
            post: {
                summary: 'Verify OTP',
                description: 'Verify a provided OTP (One-Time Password).',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: verifyEmailOTPSchema
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'OTP successfully verified.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. The provided OTP is incorrect.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/forgot-password': {
            post: {
                summary: 'Forgot Password',
                description: 'Initiate the "Forgot Password" process by sending a reset link to the user\'s email address.',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: emailRequestSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password reset link sent successfully.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '404': {
                        description: 'Not Found. The provided email address does not exist in the system.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/check-reset-link/{accountId}/{token}': {
            get: {
                summary: 'Check Reset Link',
                description: 'Check the validity of the reset link using the provided accountId and token.',
                tags: ['Authentication'],
                parameters: resetLinkParameters,
                responses: {
                    '200': {
                        description: 'Reset link is valid. Proceed to reset password.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the path parameters for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. The provided token or accountId is incorrect.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/reset-password/{accountId}/{token}': {
            post: {
                summary: 'Reset Password',
                description: 'Reset the password for the user using the provided accountId and token.',
                tags: ['Authentication'],
                parameters: resetLinkParameters,
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: resetPasswordRequestSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password successfully reset.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. The provided token or accountId is incorrect.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/change-password': {
            post: {
                summary: 'Change Password',
                description: 'Change the password for the authenticated user.',
                tags: ['Authentication'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: changePasswordRequestSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password successfully changed.',
                        schema: responseSchema
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },

        '/api/v1/auth/logout': {
            get: {
                summary: 'Logout',
                description: 'Logout the authenticated user.',
                tags: ['Authentication'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Successfully logged out.',
                        schema: responseSchema
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
    },
};

