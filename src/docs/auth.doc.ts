
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
                            schema: {
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
                                        example: 'securePassword123',
                                    },
                                },
                                required: ['name', 'username', 'email', 'dob', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User successfully registered.',
                        content: {
                            'application/json': {
                                example: {
                                    user: {
                                        id: '123456789',
                                        name: 'John Doe',
                                        email: 'john.doe@example.com',
                                        username: 'johndoe',
                                        dob: '1990-01-01',
                                        type: 1,
                                        avatar: 'https://example.com/avatar.jpg',
                                        verified: true,
                                        createdAt: '2024-02-14T12:00:00Z',
                                        updatedAt: '2024-02-14T12:30:00Z',
                                        accessToken: 'your_access_token_here',
                                    },
                                },
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
                summary: 'Login with an existing user',
                description: 'Authenticate a user and generate an access token, which could be used as a cookie or an authorization header.',
                tags: ['Authentication'],
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
                        description: 'User successfully registered.',
                        content: {
                            'application/json': {
                                example: {
                                    user: {
                                        id: '123456789',
                                        name: 'John Doe',
                                        email: 'john.doe@example.com',
                                        username: 'johndoe',
                                        dob: '1990-01-01',
                                        type: 1,
                                        avatar: 'https://example.com/avatar.jpg',
                                        verified: true,
                                        createdAt: '2024-02-14T12:00:00Z',
                                        updatedAt: '2024-02-14T12:30:00Z',
                                        accessToken: 'your_access_token_here',
                                    },
                                },
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
                                example: {
                                    accessToken: 'your_new_access_token_here',
                                },
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

        '/api/v1/change-password': {
            post: {
                summary: 'Change Password',
                description: 'Change the password for the authenticated user.',
                tags: ['Authentication'],
                security: [
                    {
                        bearerAuth: [],
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

        '/api/v1/logout': {
            post: {
                summary: 'Logout',
                description: 'Logout the authenticated user.',
                tags: ['Authentication'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successfully logged out.',
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

