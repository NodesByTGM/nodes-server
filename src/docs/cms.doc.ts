import { AppConfig } from "../utilities/config";
import { constructResponseSchema, timestampProperties, trueFileSwaggerSchema } from "./common.doc";

const cmsRequestSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        category: { type: 'string' },
        thumbnail: trueFileSwaggerSchema
    }
}

const cmsSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        category: { type: 'string' },
        thumbnail: trueFileSwaggerSchema,
        ...timestampProperties,
    }
}


const cmsQueryParams = [
    {
        name: 'title',
        in: 'query',
        description: 'Title of the content',
        required: false,
        schema: {
            type: 'string',
        }
    },
    {
        name: 'category',
        in: 'query',
        description: 'Category of the content',
        required: false,
        schema: {
            type: 'date',
            example: AppConfig.CONTENT_CATEGORIES.HiddenGems
        }
    }
]

export const cmsAdminQueryParams = [
    ...cmsQueryParams,
    {
        name: 'status',
        in: 'query',
        description: 'Status of the content',
        required: false,
        schema: {
            type: 'date',
            example: AppConfig.CONTENT_STATUSES.Published
        }
    },
]

export const cmsSwagger = {
    paths: {
        '/api/v1/cms/contents': {
            get: {
                summary: 'Get All Contents',
                description: 'Retrieve all contents.',
                tags: ['CMS'],
                security: [{ bearerAuth: [] }],
                parameters: cmsQueryParams,
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(cmsSchema, true) },
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
        '/api/v1/cms/admin/contents': {
            get: {
                summary: 'Get All Contents For Admin',
                description: 'Retrieve all contents.',
                tags: ['CMS'],
                security: [{ bearerAuth: [] }],
                parameters: cmsAdminQueryParams,
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(cmsSchema, true) },
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
            post: {
                summary: 'Create content',
                description: 'Create a content.',
                tags: ['CMS'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: cmsRequestSchema }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(cmsSchema, true) },
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
        '/api/v1/cms/admin/contents/{id}': {
            put: {
                summary: 'Update content',
                description: 'Update a particular content.',
                tags: ['CMS'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the content to edit.',
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: cmsRequestSchema }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(cmsSchema) },
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
            get: {
                summary: 'Get content',
                description: 'Get a particular content.',
                tags: ['CMS'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the content to fetch.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Success.',
                        content: {
                            'application/json': { schema: constructResponseSchema(cmsSchema) },
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
        }
    }
}