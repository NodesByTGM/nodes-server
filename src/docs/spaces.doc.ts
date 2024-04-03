import { constructResponseSchema, fileSwaggerSchema, miniUserSchema, paginationQueryParams } from "./common.doc";

const spaceSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        thumbnail: fileSwaggerSchema, // Thumbnail can be either a string or null
        rules: {
            type: 'array',
            items: { type: 'string' } // Assuming rules are strings
        },
        owner: miniUserSchema,
        members: {
            type: 'array',
            items: miniUserSchema // You might want to specify the schema for members if it's not always an empty array
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        id: { type: 'string' }
    }
};

const spaceRequestSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        thumbnail: fileSwaggerSchema, // Thumbnail can be either a string or null
        rules: {
            type: 'array',
            items: { type: 'string' } // Assuming rules are strings
        },
    },
    required: ['name', 'description']
};

export const spacesSwagger = {
    paths: {
        '/api/v1/spaces': {
            get: {
                summary: 'Get All Spaces',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(spaceSchema, true) }
                        }
                    },
                },
            },
            post: {
                summary: 'Create Space',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: spaceSchema,
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(spaceSchema) }
                        }
                    },
                },
            },
            put: {
                summary: 'Update Space',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: spaceSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(spaceSchema) }
                        }
                    },
                },
            },
        },
        '/api/v1/spaces/mine': {
            get: {
                summary: 'Get My Spaces',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(spaceSchema, true) }
                        }
                    },
                },
            },
        },
        '/api/v1/spaces/{id}': {
            get: {
                summary: 'Get a specific space by ID',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(spaceSchema) }
                        }
                    },
                    // Add more response codes if necessary
                }
            },
            put: {
                summary: 'Update a specific spaces by ID',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }], // Moved tags field here
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: spaceRequestSchema
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(spaceSchema) }
                        }
                    },
                    // Add more response codes if necessary
                }
            },
            // delete: {
            //     summary: 'Delete a specific spaces by ID',
            //     tags: ['Spaces'],
                // security: [{ bearerAuth: [] }],
            //     security: [{ bearerAuth: [] }],
            //     parameters: [
            //         {
            //             name: 'id',
            //             in: 'path',
            //             required: true,
            //             schema: {
            //                 type: 'string'
            //             }
            //         }
            //     ],
            //     responses: {
            //         200: { description: 'OK' },
            //         // Add more response codes if necessary
            //     }
            // }
        },
        '/api/v1/spaces/join/{id}': {
            post: {
                summary: 'Join a space by ID',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: { description: 'OK' },
                    content: {
                        'application/json': { schema: constructResponseSchema(spaceSchema) }
                    }
                    // Add more response codes if necessary
                }
            }
        },
        '/api/v1/spaces/leave/{id}': {
            post: {
                summary: 'Leave a space by ID',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: { description: 'OK' },
                    content: {
                        'application/json': { schema: constructResponseSchema(spaceSchema) }
                    }
                    // Add more response codes if necessary
                }
            }
        },
        '/api/v1/spaces/add-member/{id}': {
            post: {
                summary: 'Add a member by ID (Owner)',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: { description: 'OK' },
                    content: {
                        'application/json': { schema: constructResponseSchema(spaceSchema) }
                    }
                    // Add more response codes if necessary
                }
            }
        },
        '/api/v1/spaces/remove-member/{id}': {
            post: {
                summary: 'Remove a member by ID (Owner)',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: { description: 'OK' },
                    content: {
                        'application/json': { schema: constructResponseSchema(spaceSchema) }
                    }
                    // Add more response codes if necessary
                }
            }
        },
        '/api/v1/spaces/make-admin/{id}': {
            post: {
                summary: 'Make a member an Admin by ID (Owner)',
                tags: ['Spaces'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: { description: 'OK' },
                    content: {
                        'application/json': { schema: constructResponseSchema(spaceSchema) }
                    }
                    // Add more response codes if necessary
                }
            }
        },
    },
};
