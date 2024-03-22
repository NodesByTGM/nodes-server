const jobSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        experience: { type: 'string' },
        payRate: { type: 'number' },
        workRate: { type: 'string' },
        skills: { type: 'array', items: { type: 'string' } },
        jobType: { type: 'number' }
    },
    required: ['name', 'description', 'experience', 'payRate', 'workRate', 'skills', 'jobType']
};

export const jobSwagger = {
    paths: {
        '/api/v1/jobs/': {
            post: {
                summary: 'Create a new job',
                tags: ['Jobs'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: jobSchema
                        }
                    }
                },
                responses: {
                    200: { description: 'OK' },
                    // Add more response codes if necessary
                }
            },
            get: {
                summary: 'Get all jobs',
                tags: ['Jobs'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'OK' },
                    // Add more response codes if necessary
                }
            }
        },
        '/api/v1/jobs/{id}': {
            get: {
                summary: 'Get a specific job by ID',
                tags: ['Jobs'],
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
                            'application/json': {
                                schema: jobSchema
                            }
                        }
                    },
                    // Add more response codes if necessary
                }
            },
            put: {
                summary: 'Update a specific job by ID',
                tags: ['Jobs'], // Moved tags field here
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
                requestBody: {
                    content: {
                        'application/json': {
                            schema: jobSchema
                        }
                    }
                },
                responses: {
                    200: { description: 'OK' },
                    // Add more response codes if necessary
                }
            },
            delete: {
                summary: 'Delete a specific job by ID',
                tags: ['Jobs'],
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
                    // Add more response codes if necessary
                }
            }
        },
        '/api/v1/jobs/apply/{id}': {
            post: {
                summary: 'Apply to a specific job by ID',
                tags: ['Jobs'],
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
                    // Add more response codes if necessary
                }
            }
        },
        '/api/v1/jobs/save/{id}': {
            post: {
                summary: 'Save a job using a specific job by ID',
                tags: ['Jobs'],
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
                    // Add more response codes if necessary
                }
            }
        },
        "/api/v1/jobs/saved": {
            get: {
                summary: "Get saved jobs",
                tags: ['Jobs'],
                responses: {
                    200: {
                        description: "A list of saved jobs",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        jobs: {
                                            type: "array",
                                            items: {
                                                $ref: jobSchema,
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
        "/api/v1/jobs/applied": {
            get: {
                summary: "Get applied jobs",
                tags: ['Jobs'],
                responses: {
                    200: {
                        description: "A list of applied jobs",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        jobs: {
                                            type: "array",
                                            items: {
                                                $ref: jobSchema,
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
        "/api/v1/jobs/mine": {
            get: {
                summary: "Get jobs created by you",
                tags: ['Jobs'],
                responses: {
                    200: {
                        description: "A list of applied jobs",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        jobs: {
                                            type: "array",
                                            items: {
                                                $ref: jobSchema,
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
    }
};