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
                tags:['Projects'],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
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
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: 'Create Project',
                tags:['Projects'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
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
                                        oneOf: [
                                            {
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
                                            {
                                                type: 'string',
                                                format: 'binary',
                                            },
                                        ],
                                        description: 'Thumbnail of the project (can be binary or an object)',
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
                                        description: 'Array of images associated with the project',
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
                                        description: 'Array of collaborators associated with the project',
                                    },
                                },
                                required: ['name', 'description', 'projectURL'],
                            },
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
