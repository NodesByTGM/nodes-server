import { constructResponseSchema, eventSchema, paginationQueryParams } from "./common.doc";

const eventRequestSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'Name of the event.',
            example: 'Event 1',
        },
        description: {
            type: 'string',
            description: 'Description of the event.',
            example: 'Event description',
        },
        location: {
            type: 'string',
            description: 'Location of the event.',
            example: 'Lagos',
        },
        dateTime: {
            type: 'string',
            description: 'Date and time of the event.',
            example: '05/10/2024',
        },
        paymentType: {
            type: 'string',
            description: 'Work rate for the event.',
            example: 'free',
        },
        thumbnail: {
            type: 'object',
            description: 'A thumbnail picture for the event.',
            example: { 'id': '', url: '' },
        },
    },
    required: ['name', 'description', 'location', 'dateTime', 'paymentType']
};

export const eventSwagger = {
    paths: {
        '/api/v1/events/': {
            post: {
                summary: 'Create an event',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: eventRequestSchema
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Event created successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema) }
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
                summary: 'Get all events',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema, true) }
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
        '/api/v1/events/{id}': {
            get: {
                summary: 'Get an event by ID',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the event to retrieve.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Event not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
            put: {
                summary: 'Update an event by ID',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the event to update.',
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: eventRequestSchema
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Event updated successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema) }
                        }
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Event not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
            delete: {
                summary: 'Delete an event by ID',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the event to delete.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Event deleted successfully.',
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Event not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        '/api/v1/events/save/{id}': {
            post: {
                summary: 'Save an event',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the event to save.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Event saved successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Event not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        '/api/v1/events/register/{id}': {
            post: {
                summary: 'Register for an event',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the event to register for.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Event registered successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Event not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        '/api/v1/events/unsave/{id}': {
            post: {
                summary: 'Unsave an event',
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the event to save.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Event saved successfully.',
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '404': {
                        description: 'Event not found.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        "/api/v1/events/saved": {
            get: {
                summary: "Get saved events",
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of saved events",
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema, true) }
                        }
                    },
                },
            },
        },
        "/api/v1/events/mine": {
            get: {
                summary: "Get events created by you",
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of applied events",
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema, true) }
                        }
                    },
                },
            },
        },
        "/api/v1/events/registered": {
            get: {
                summary: "Get registered events by you",
                tags: ['Events'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of registered events",
                        content: {
                            'application/json': { schema: constructResponseSchema(eventSchema, true) }
                        }
                    },
                },
            },
        },
    }
};
