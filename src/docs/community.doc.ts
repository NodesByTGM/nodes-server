import { AppConfig } from "../utilities/config";
import { paginationQueryParams } from "./common.doc";

const postSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'string',
            description: 'Body of the post.',
            example: 'Heyyy guys',
        },
        attachments: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'ID for the attachment.',
                        example: '',
                    },
                    url: {
                        type: 'string',
                        description: 'ID for the attachment.',
                        example: '',
                    },
                }
            }
        },
        hashtags: {
            type: 'array',
            items: {
                type: 'string',
                description: 'An attachment for the post.',
                example: "#2024",
            }

        },
        likes: {
            type: 'array',
            items: {
                type: 'string',
                description: 'Likes.',
                example: "654dsdt6567898",
            }
        },
        parent: {
            type: 'string',
            description: 'Parent post of the post (for comments)',
            example: '6d8909876545678',
        },
        author: {
            type: 'object',
            properties: {
                name: {
                    type: 'object',
                    description: 'Name of the author',
                    example: "Author",
                },
                id: {
                    type: 'object',
                    description: 'ID of the author',
                    example: "Author",
                },
                avatar: {
                    type: 'object',
                    description: 'The avatar for the author.',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID for the avatar.',
                            example: '',
                        },
                        url: {
                            type: 'string',
                            description: 'URL for the avatar.',
                            example: '',
                        },
                    },
                    example: { id: '', url: '' },
                },
            }
        },
        createdAt: {
            type: 'string',
            description: 'Date and time of the post.',
            example: '05/10/2024',
        },
        comments: {
            type: 'array',
            description: 'Comments under this post',
            example: [{}],
        },
    },
    required: ['body']
};
// text, author, hashtags, startDate, endDate
const paginatedPostSchema = {
    type: 'object',
    properties: {
        message: {
            type: 'string',
            description: 'Success',
            example: 'Success',
        },
        items: {
            type: 'array',
            items: { type: 'object', properties: postSchema.properties }
        },
        currentPage: { type: 'number', example: 1 },
        pageSize: { type: 'number', example: AppConfig.DEFAULT_PAGE_SIZE },
        totalPages: { type: 'number', example: 1 },
        totalItems: { type: 'number', example: 1 },
    }
}

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

export const communitySwagger = {
    paths: {
        '/api/v1/community/posts/': {
            post: {
                summary: 'Create an post',
                tags: ['Community'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: postSchema
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Post created successfully.',
                        // content: {
                        //     'application/json': { schema: paginatedPostSchema }
                        // }
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
                tags: ['Community'],
                parameters: qsParams,
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: paginatedPostSchema }
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
        '/api/v1/community/posts/{id}': {
            get: {
                summary: 'Get a post by ID',
                tags: ['Community'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
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
            //     tags: ['Community'],
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
            //     tags: ['Community'],
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
        '/api/v1/community/posts/like/{id}': {
            post: {
                summary: 'Like a post',
                tags: ['Community'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
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
                        description: 'Post saved successfully.',
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
        '/api/v1/community/posts/unlike/{id}': {
            post: {
                summary: 'Unlike a post',
                tags: ['Community'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
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
                        description: 'Post saved successfully.',
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
