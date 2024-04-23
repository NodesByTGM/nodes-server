import { adminMiniUserSchema, adminSchema, adminSubscriptionSchema, constructResponseSchema, userSchema } from "./common.doc";

const subscriptionQueryParams = [
    {
        name: 'startDate',
        in: 'query',
        description: 'Date to begin from during search',
        required: false,
        schema: {
            type: 'date',
            default: 1
        }
    },
    {
        name: 'endDate',
        in: 'query',
        description: 'Date to stop at during search',
        required: false,
        schema: {
            type: 'date',
        }
    }
]

// router.delete('/users/:id', authenticateAdmin, adminControllers.deleteUser);

export const adminSwagger = {
    paths: {
        '/api/v1/admin/users': {
            get: {
                summary: 'Get All Users',
                description: 'Retrieve all users mini-information.',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(adminMiniUserSchema, true) },
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
        '/api/v1/admin/users/{id}': {
            get: {
                summary: 'Get User',
                description: 'Retrieve a particular user\'s profile information.',
                tags: ['Admin'],
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
                            'application/json': { schema: constructResponseSchema(userSchema) },
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
            // delete: {
            //     summary: 'Delete User',
            //     description: 'Retrieve a particular user\'s profile information.',
            //     tags: ['Admin'],
            //     security: [{ bearerAuth: [] }],
            //     parameters: [
            //         {
            //             name: 'id',
            //             in: 'path',
            //             required: true,
            //             schema: {
            //                 type: 'string',
            //             },
            //             description: 'ID of the user to retrieve.',
            //         }
            //     ],
            //     responses: {
            //         '200': {
            //             description: 'Success.'
            //         },
            //         '401': {
            //             description: 'Unauthorized. User authentication failed.',
            //         },
            //         '500': {
            //             description: 'Internal Server Error.',
            //         },
            //     },
            // },
        },
        '/api/v1/admin/members': {
            get: {
                summary: 'Get All Members',
                description: 'Retrieves all admin member\'s information, used in Team management.',
                tags: ['Admin', 'Team management'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(adminSchema, true) },
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
        '/api/v1/admin/members/{id}': {
            get: {
                summary: 'Get A Member\'s Profile',
                description: 'Retrieve a particular member\'s profile information.',
                tags: ['Admin', 'Team management'],
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
                            'application/json': { schema: constructResponseSchema(userSchema) },
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
        '/api/v1/admin/subscriptions': {
            get: {
                summary: 'Get All User Subscriptions',
                description: 'Retrieves all user subscriptions',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                parameters: subscriptionQueryParams,
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(adminSubscriptionSchema, true) },
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
        // 'api/v1/admin/analytics': {},
    }
}