export const usersSwagger = {
    paths: {
        '/api/v1/users/profile': {
            get: {
                summary: 'Get User Profile',
                description: 'Retrieve the authenticated user\'s profile information.',
                tags: ['Profile'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
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
                                        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                                        skills: 'Java, JavaScript, SQL',
                                        location: 'City, Country',
                                        linkedIn: 'https://www.linkedin.com/in/johndoe',
                                        instagram: 'https://www.instagram.com/johndoe',
                                        twitter: 'https://twitter.com/johndoe',
                                        spaces: false,
                                        comments: false,
                                        headline: '',
                                        bio: '',
                                        website: 'https://twitter.com/johndoe',
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
            put: {
                summary: 'Update Profile',
                tags: ['Profile'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        description: 'Name of the user',
                                    },
                                    avatar: {
                                        type: 'string',
                                        description: 'URL or binary data for the user avatar',
                                    },
                                    skills: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                        },
                                        description: 'Array of user skills',
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'Location of the user',
                                    },
                                    linkedIn: {
                                        type: 'string',
                                        description: 'LinkedIn profile URL',
                                    },
                                    instagram: {
                                        type: 'string',
                                        description: 'Instagram profile URL',
                                    },
                                    twitter: {
                                        type: 'string',
                                        description: 'Twitter profile URL',
                                    },
                                    headline: {
                                        type: 'string',
                                        description: 'User\'s professional headline',
                                    },
                                    bio: {
                                        type: 'string',
                                        description: 'User\'s biography',
                                    },
                                    website: {
                                        type: 'string',
                                        description: 'User\'s personal website URL',
                                    },
                                    spaces: {
                                        type: 'boolean',
                                        description: 'Boolean indicating user\'s spaces',
                                    },
                                    comments: {
                                        type: 'boolean',
                                        description: 'Boolean indicating user\'s comments',
                                    },
                                    companyName: {
                                        type: 'string',
                                        description: 'Name of the company the user works for',
                                    },
                                    logo: {
                                        type: 'string',
                                        description: 'URL or binary data for the company logo',
                                    },
                                    yoe: {
                                        type: 'integer',
                                        description: 'Years of experience',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Update successful message',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }
}
