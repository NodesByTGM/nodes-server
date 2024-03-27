import { AppConfig } from "../utilities/config";
import { paginationQueryParams } from "./common.doc";

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
const paginatedJobSchema = {
    type: 'object',
    properties: {
        message: {
            type: 'string',
            description: 'Success',
            example: 'Success',
        },
        items: {
            type: 'array',
            items: { type: 'object', properties: jobSchema.properties }
        },
        currentPage: { type: 'number', example: 1 },
        pageSize: { type: 'number', example: AppConfig.DEFAULT_PAGE_SIZE },
        totalPages: { type: 'number', example: 1 },
        totalItems: { type: 'number', example: 1 },
    }
}

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
                    // content: {
                    //     'application/json': { schema: paginatedJobSchema }
                    // }
                }
            },
            get: {
                summary: 'Get all jobs',
                tags: ['Jobs'],
                parameters: paginationQueryParams,
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'OK' },
                    content: {
                        'application/json': { schema: paginatedJobSchema }
                    }
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
        '/api/v1/jobs/unsave/{id}': {
            post: {
                summary: 'Unsave a job using a specific job by ID',
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
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of saved jobs",
                        content: {
                            'application/json': { schema: paginatedJobSchema }
                        }
                    },
                },
            },
        },
        "/api/v1/jobs/applied": {
            get: {
                summary: "Get applied jobs",
                tags: ['Jobs'],
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of applied jobs",
                        content: {
                            'application/json': { schema: paginatedJobSchema }
                        }
                    },
                },
            },
        },
        "/api/v1/jobs/mine": {
            get: {
                summary: "Get jobs created by you",
                tags: ['Jobs'],
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of applied jobs",
                        content: {
                            'application/json': { schema: paginatedJobSchema }
                        }
                    },
                },
            },
        },
    }
};