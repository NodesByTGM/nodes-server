import { paginationQueryParams } from "./common.doc";
const projectSchema = {
    type: 'object',
    properties: {
        projectId: {
            type: 'string',
            description: 'Unique identifier for the project',
        },
        name: {
            type: 'string',
            description: 'Name of the project',
        },
        description: {
            type: 'string',
            description: 'Description of the project',
        },
        projectURL: {
            type: 'string',
            description: 'URL of the project',
        },
        thumbnail: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Unique identifier for the thumbnail',
                },
                url: {
                    type: 'string',
                    description: 'URL to access the thumbnail',
                },
            },
        },
        images: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier for the image',
                    },
                    url: {
                        type: 'string',
                        description: 'URL to access the image',
                    },
                },
            },
        },
        collaborators: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Name of the collaborator',
                    },
                    role: {
                        type: 'string',
                        description: 'Role of the collaborator',
                    },
                },
            },
        },
    },
    required: ['name', 'description', 'projectURL'],
}
export const projectsSwagger = {
    // openapi: '3.0.0',
    // info: {
    //   title: 'Project API',
    //   version: '1.0.0',
    // },
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
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: projectSchema.properties
                                    },
                                },
                            },
                        },
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
                            schema: projectSchema,
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
                                        projectId: {
                                            type: 'string',
                                            description: 'Unique identifier for the created project',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
