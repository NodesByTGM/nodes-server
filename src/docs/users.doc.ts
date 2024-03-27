import { userSchema, userSchemaExample } from "./common.doc";

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
                                    user: userSchemaExample,
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
                            schema: userSchema,
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
