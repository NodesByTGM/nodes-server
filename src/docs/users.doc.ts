import { businessProfileRequestSchema, communityUserSchema, constructResponseSchema, miniUserSchema, profileRequestSchema, userSchema } from "./common.doc";

export const usersSwagger = {
    paths: {
        '/api/v1/users/': {
            get: {
                summary: 'Get All Users',
                description: 'Retrieve all users mini-information.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(communityUserSchema, true) },
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
        },
        '/api/v1/users/{id}': {
            get: {
                summary: 'Get All Users',
                description: 'Retrieve the authenticated user\'s profile information.',
                tags: ['Profile'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the user to retrieve.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(miniUserSchema) },
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
        },
        '/api/v1/users/profile': {
            get: {
                summary: 'Get User Profile',
                description: 'Retrieve the authenticated user\'s profile information.',
                tags: ['Profile'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: userSchema },
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
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: profileRequestSchema, },
                    },
                },
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(userSchema) },
                        },
                    },
                },
            },
        },
        '/api/v1/users/business-profile': {
            // get: {
            //     summary: 'Get User\'s Business Profile',
            //     description: 'Retrieve the authenticated user\'s business profile information.',
            //     tags: ['Profile'],
            //     security: [{ bearerAuth: [] }],
            //     responses: {
            //         '200': {
            //             description: 'Success.',
            //             content: {
            //                 'application/json': { schema: userSchema },
            //             },
            //         },
            //         '401': {
            //             description: 'Unauthorized. User authentication failed.',
            //         },
            //         '500': {
            //             description: 'Internal Server Error.',
            //         },
            //     },
            // },
            put: {
                summary: 'Update Profile',
                tags: ['Profile'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: businessProfileRequestSchema, },
                    },
                },
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(userSchema) },
                        },
                    },
                },
            },
        }
    }
}