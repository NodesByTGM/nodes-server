import { constructResponseSchema, fileSwaggerSchema, paginationQueryParams, projectSchema } from "./common.doc";
const projectRequestSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', },
        description: { type: 'string', },
        projectURL: { type: 'string', },
        thumbnail: fileSwaggerSchema,
        images: {
            type: 'array',
            items: fileSwaggerSchema,
        },
        collaborators: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string', },
                    role: { type: 'string', },
                },
            },
        },
    },
    required: ['name', 'description', 'projectURL'],
}

export const projectsSwagger = {
    paths: {
        '/api/v1/projects': {
            get: {
                summary: 'Get All Projects',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(projectSchema, true) }
                        }
                    },
                },
            },
            post: {
                summary: 'Create Project',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: projectRequestSchema,
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(projectSchema) }
                        }
                    },
                },
            },
        },

        '/api/v1/projects/{id}': {
            get: {
                summary: 'Get A Project',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the project to retrieve.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(projectSchema) }
                        }
                    },
                },
            },
        },
        '/api/v1/projects/mine': {
            get: {
                summary: 'Get My Projects',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(projectSchema, true) }
                        }
                    },
                },
            },
        }
    },
};
