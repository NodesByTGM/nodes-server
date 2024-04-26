import {
    businessProfileRequestSchema,
    communityUserSchema,
    connectionRequestResponseSchema,
    connectionRequestSchema,
    constructResponseSchema,
    initConnectionRequestResponseSchema,
    paginationQueryParams,
    profileRequestSchema,
    singleCommunityUserSchema,
    userSchema
} from "./common.doc";



// router.post('/connections/request/:id', authenticate, usersControllers.requestConnection);
// router.delete('/connections/remove/:id', authenticate, usersControllers.removeConnection);

export const usersSwagger = {
    paths: {
        '/api/v1/users/': {
            get: {
                summary: 'Get All Users',
                description: 'Retrieve all users mini-information.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
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
        '/api/v1/users/discover': {
            get: {
                summary: 'Discover Users',
                description: 'Discover users you\'ve not connected with.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
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
                            'application/json': { schema: constructResponseSchema(singleCommunityUserSchema) },
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
        },

        '/api/v1/users/connections/request/{id}': {
            post: {
                summary: 'Request Connection',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the user.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(initConnectionRequestResponseSchema) },
                        },
                    },
                },
            },
        },
        '/api/v1/users/connections/requests': {
            get: {
                summary: 'Get All Connection requests',
                description: 'Retrieve all Connection requests',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(connectionRequestSchema, true) },
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
        '/api/v1/users/connections/requests/accept/{id}': {
            post: {
                summary: 'Accept Request',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the request.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(connectionRequestResponseSchema) },
                        },
                    },
                },
            },
        },
        '/api/v1/users/connections/requests/reject/{id}': {
            post: {
                summary: 'Reject Request',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the request.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(connectionRequestResponseSchema) },
                        },
                    },
                },
            },
        },
        '/api/v1/users/connections/requests/abandon/{id}': {
            post: {
                summary: 'Abandon Request',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the request.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(connectionRequestResponseSchema) },
                        },
                    },
                },
            },
        },

        '/api/v1/users/connections/remove/{id}': {
            delete: {
                summary: 'Remove Connection, request in response is returned as null',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the user.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(connectionRequestResponseSchema) },
                        },
                    },
                },
            },
        },
        '/api/v1/users/connections/{id}': {
            get: {
                summary: 'Get User Connections',
                description: 'Get Connections of other users using their ID',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    ...paginationQueryParams,
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the user.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(communityUserSchema, true) },
                        },
                    },
                },
            },
        },
        '/api/v1/users/connections/mine': {
            get: {
                summary: 'Get your Connections',
                tags: ['Users', 'Connections'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(communityUserSchema, true) },
                        },
                    },
                },
            },
        },
    }
}