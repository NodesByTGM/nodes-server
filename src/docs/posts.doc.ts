import { constructResponseSchema, fileSwaggerSchema, paginationQueryParams, postSchema } from "./common.doc";

const postRequestSchema = {
    type: 'object',
    properties: {
        body: { type: 'string' },
        type: { type: 'string' },
        forignKey: { type: 'string' },
        attachments: {
            type: 'array',
            items: fileSwaggerSchema
        },
        hashtags: {
            type: 'array',
            items: { type: 'string' }
        },
    },
    required: ['body', 'type']
    
};

export const qsParams = [
    ...paginationQueryParams,

    {
        in: 'query',
        name: 'body',
        schema: {
            type: 'string',
        },
        example: 'bob',
    },
    {
        in: 'query',
        name: 'author',
        schema: {
            type: 'string',
        },
        example: '654edrt78765',
    },
    {
        in: 'query',
        name: 'hashtags',
        schema: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        example: ['#2024'],
    },
    {
        in: 'query',
        name: 'startDate',
        schema: {
            type: 'string',
        },
        description: 'Date and time of the post.',
        example: '05/10/2024',
    },
    {
        in: 'query',
        name: 'endDate',
        schema: {
            type: 'string',
        },
        description: 'Date and time of the post.',
        example: '05/10/2024',
    },
]


export const yourQSParams = [
    ...paginationQueryParams,

    {
        in: 'query',
        name: 'body',
        schema: {
            type: 'string',
        },
        example: 'bob',
    },
    {
        in: 'query',
        name: 'hashtags',
        schema: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        example: ['#2024'],
    },
    {
        in: 'query',
        name: 'startDate',
        schema: {
            type: 'string',
        },
        description: 'Date and time of the post.',
        example: '05/10/2024',
    },
    {
        in: 'query',
        name: 'endDate',
        schema: {
            type: 'string',
        },
        description: 'Date and time of the post.',
        example: '05/10/2024',
    },
]

export const postsSwagger = {
    paths: {
        '/api/v1/posts/': {
            post: {
                summary: 'Create an post',
                tags: ['Posts'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: postRequestSchema
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Post created successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(postSchema) }
                        }
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
            get: {
                summary: 'Get all posts',
                tags: ['Posts'],
                parameters: qsParams,
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(postSchema, true) }
                        }
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
        '/api/v1/posts/mine': {
            get: {
                summary: 'Get all your posts',
                tags: ['Posts'],
                parameters: yourQSParams,
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(postSchema, true) }
                        }
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
        '/api/v1/posts/{id}': {
            get: {
                summary: 'Get a post by ID',
                tags: ['Posts'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the post to retrieve.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(postSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Post not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
            // put: {
            //     summary: 'Update an post by ID',
            //     tags: ['Posts'],
            //     security: [
            //         {
            //             bearerAuth: [],
            //         },
            //     ],
            //     parameters: [
            //         {
            //             name: 'id',
            //             in: 'path',
            //             required: true,
            //             schema: {
            //                 type: 'string',
            //             },
            //             description: 'ID of the post to update.',
            //         }
            //     ],
            //     requestBody: {
            //         required: true,
            //         content: {
            //             'application/json': {
            //                 schema: postSchema
            //             }
            //         }
            //     },
            //     responses: {
            //         '200': {
            //             description: 'Post updated successfully.',
            //         },
            //         '400': {
            //             description: 'Bad request. Check the request payload for missing or invalid information.',
            //         },
            //         '401': {
            //             description: 'Unauthorized. User authentication failed.',
            //         },
            //         '404': {
            //             description: 'Post not found.',
            //         },
            //         '500': {
            //             description: 'Internal Server Error.',
            //         },
            //     },
            // },
            // delete: {
            //     summary: 'Delete an post by ID',
            //     tags: ['Posts'],
            //     security: [
            //         {
            //             bearerAuth: [],
            //         },
            //     ],
            //     parameters: [
            //         {
            //             name: 'id',
            //             in: 'path',
            //             required: true,
            //             schema: {
            //                 type: 'string',
            //             },
            //             description: 'ID of the post to delete.',
            //         }
            //     ],
            //     responses: {
            //         '200': {
            //             description: 'Post deleted successfully.',
            //         },
            //         '401': {
            //             description: 'Unauthorized. User authentication failed.',
            //         },
            //         '404': {
            //             description: 'Post not found.',
            //         },
            //         '500': {
            //             description: 'Internal Server Error.',
            //         },
            //     },
            // },
        },
        '/api/v1/posts/like/{id}': {
            post: {
                summary: 'Like a post',
                tags: ['Posts'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the post to like.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Post liked successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(postSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Post not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        '/api/v1/posts/unlike/{id}': {
            post: {
                summary: 'Unlike a post',
                tags: ['Posts'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the post to unlike.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Post unliked successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(postSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Post not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
    }
};
