import { constructResponseSchema, fileSwaggerSchema, paginationQueryParams } from "./common.doc";
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

const projectSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        projectURL: { type: 'string', format: 'uri' },
        images: {
            type: 'array',
            items: fileSwaggerSchema // Assuming image URLs are strings
        },
        collaborators: {
            type: 'array',
            items: fileSwaggerSchema // Assuming collaborator IDs are strings
        },
        owner: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        id: { type: 'string' }
    }
};

export const projectsSwagger = {
    paths: {
        '/api/v1/projects': {
            get: {
                summary: 'Get All Projects',
                tags: ['Projects'],
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
        '/api/v1/projects/mine': {
            get: {
                summary: 'Get My Projects',
                tags: ['Projects'],
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
