import { adminAuthUserSchema, constructResponseSchema, responseSchema, tokensSchema } from "./common.doc";

export const adminAuthSwagger = {
    paths: {
        // '/api/v1/admin/auth/register': {
        //     post: {
        //         summary: 'User Registration',
        //         description: 'Register a new user with the provided information.',
        //         tags: ['Admin Authentication'],
        //         requestBody: {
        //             required: true,
        //             content: {
        //                 'application/json': {
        //                     schema: {
        //                         type: 'object',
        //                         properties: {
        //                             name: {
        //                                 type: 'string',
        //                                 description: 'The full name of the user.',
        //                                 example: 'John Doe',
        //                             },
        //                             username: {
        //                                 type: 'string',
        //                                 description: 'The desired username for the user.',
        //                                 example: 'john_doe',
        //                             },
        //                             email: {
        //                                 type: 'string',
        //                                 format: 'email',
        //                                 description: 'The email address of the user.',
        //                                 example: 'john@example.com',
        //                             },
        //                             dob: {
        //                                 type: 'string',
        //                                 format: 'date',
        //                                 description: 'The date of birth of the user (in YYYY-MM-DD format).',
        //                                 example: '1990-01-01',
        //                             },
        //                             otp: {
        //                                 type: 'string',
        //                                 description: 'One-time password (optional, used for additional verification).',
        //                                 example: '123456',
        //                             },
        //                             password: {
        //                                 type: 'string',
        //                                 format: 'password',
        //                                 description: 'The password for the user account.',
        //                                 example: 'securePassword123',
        //                             },
        //                         },
        //                         required: ['name', 'username', 'email', 'dob', 'password'],
        //                     },
        //                 },
        //             },
        //         },
        //         responses: {
        //             '201': {
        //                 description: 'User successfully registered.',
        //                 content: {
        //                     'application/json': {
        //                         schema: constructResponseSchema(adminAuthUserSchema),
        //                     },
        //                 },
        //             },
        //             '400': {
        //                 description: 'Bad request. Check the request payload for missing or invalid information.',
        //             },
        //             '500': {
        //                 description: 'Internal Server Error.',
        //             },
        //         },
        //     },
        // },

        '/api/v1/admin/auth/login': {
            post: {
                summary: 'Login with an existing user',
                description: 'Authenticate a user and generate an access token, which could be used as a cookie or an authorization header.',
                tags: ['Admin Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        description: 'The username of the user.',
                                        example: 'john_doe',
                                    },
                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        description: 'The password of the user.',
                                        example: 'password123',
                                    },
                                },
                                required: ['username', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User successfully logged in.',
                        content: {
                            'application/json': {
                                schema: constructResponseSchema(adminAuthUserSchema),
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

        '/api/v1/admin/auth/refresh-token': {
            post: {
                summary: 'Refresh Access Token',
                description: 'Obtain a new access token using a refresh token.',
                tags: ['Admin Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    refreshToken: {
                                        type: 'string',
                                        description: 'The refresh token.',
                                        example: 'your_refresh_token_here',
                                    },
                                },
                                required: ['refreshToken'],
                            },
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

        '/api/v1/admin/auth/send-otp': {
            post: {
                summary: 'Send OTP via Email',
                description: 'Send a one-time password (OTP) to the provided email address for user registration verification.',
                tags: ['Admin Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        description: 'The email address to which the OTP will be sent.',
                                        example: 'john@example.com',
                                    },
                                },
                                required: ['email'],
                            },
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
        '/api/v1/admin/auth/verify-email': {
            post: {
                summary: 'Verify Email with OTP',
                description: 'Verify the user\'s email address using the provided OTP (One-Time Password).',
                tags: ['Admin Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        description: 'The email address to be verified.',
                                        example: 'john@example.com',
                                    },
                                    otp: {
                                        type: 'string',
                                        description: 'The one-time password (OTP) sent to the user\'s email address.',
                                        example: '123456',
                                    },
                                },
                                required: ['email', 'otp'],
                            },
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
        '/api/v1/admin/auth/check-email': {
            post: {
                summary: 'Check if Email exists already',
                description: 'Check if Email exists already using user\'s email address.',
                tags: ['Admin Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        description: 'The email address to be checked.',
                                        example: 'john@example.com',
                                    },
                                },
                                required: ['email'],
                            },
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

        '/api/v1/admin/auth/verify-otp': {
            post: {
                summary: 'Verify OTP',
                description: 'Verify a provided OTP (One-Time Password).',
                tags: ['Admin Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    otp: {
                                        type: 'string',
                                        description: 'The one-time password (OTP) to be verified.',
                                        example: '123456',
                                    },
                                    email: {
                                        type: 'string',
                                        description: 'The email associated with the OTP.',
                                        example: 'user@example.com',
                                    },
                                },
                                required: ['otp', 'email'],
                            },
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

        '/api/v1/admin/auth/forgot-password': {
            post: {
                summary: 'Forgot Password',
                description: 'Initiate the "Forgot Password" process by sending a reset link to the user\'s email address.',
                tags: ['Admin Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        description: 'The email address for which the password reset link will be sent.',
                                        example: 'john@example.com',
                                    },
                                },
                                required: ['email'],
                            },
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

        '/api/v1/admin/auth/check-reset-link/{accountId}/{token}': {
            get: {
                summary: 'Check Reset Link',
                description: 'Check the validity of the reset link using the provided accountId and token.',
                tags: ['Admin Authentication'],
                parameters: [
                    {
                        in: 'path',
                        name: 'accountId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The unique identifier associated with the user\'s account.',
                        example: 'abc123',
                    },
                    {
                        in: 'path',
                        name: 'token',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The token provided in the reset link.',
                        example: 'xyz789',
                    },
                ],
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
                tags: ['Admin Authentication'],
                parameters: [
                    {
                        in: 'path',
                        name: 'accountId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The unique identifier associated with the user\'s account.',
                        example: 'abc123',
                    },
                    {
                        in: 'path',
                        name: 'token',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'The token provided for password reset.',
                        example: 'xyz789',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        description: 'The new password for the user.',
                                        example: 'newPassword456',
                                    },
                                },
                                required: ['password'],
                            },
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

        '/api/v1/admin/auth/change-password': {
            post: {
                summary: 'Change Password',
                description: 'Change the password for the authenticated user.',
                tags: ['Admin Authentication'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        description: 'The current password of the user.',
                                        example: 'currentPassword123',
                                    },
                                    newPassword: {
                                        type: 'string',
                                        format: 'password',
                                        description: 'The new password for the user.',
                                        example: 'newPassword456',
                                    },
                                },
                                required: ['password', 'newPassword'],
                            },
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

        '/api/v1/admin/auth/logout': {
            post: {
                summary: 'Logout',
                description: 'Logout the authenticated user.',
                tags: ['Admin Authentication'],
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

