import { AppConfig } from "../utilities/config";
import { paginationQueryParams } from "./common.doc";

const eventSchema = {
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

const paginatedEventSchema = {
    type: 'object',
    properties: {
        message: {
            type: 'string',
            description: 'Success',
            example: 'Success',
        },
        items: {
            type: 'array',
            items: { type: 'object', properties: eventSchema.properties }
        },
        currentPage: { type: 'number', example: 1 },
        pageSize: { type: 'number', example: AppConfig.DEFAULT_PAGE_SIZE },
        totalPages: { type: 'number', example: 1 },
        totalItems: { type: 'number', example: 1 },
    }
}

export const eventSwagger = {
    paths: {
        '/api/v1/events/': {
            post: {
                summary: 'Create an event',
                tags: ['Events'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: eventSchema
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Event created successfully.',
                        // content: {
                        //     'application/json': { schema: paginatedEventSchema }
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
                summary: 'Get all events',
                tags: ['Events'],
                parameters: paginationQueryParams,
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: paginatedEventSchema }
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
                        description: 'ID of the event to retrieve.',
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
                        description: 'ID of the event to update.',
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: eventSchema
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Event updated successfully.',
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
                        description: 'ID of the event to save.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Event saved successfully.',
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
                        description: 'ID of the event to save.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Event saved successfully.',
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
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of saved events",
                        content: {
                            'application/json': { schema: paginatedEventSchema }
                        }
                    },
                },
            },
        },
        "/api/v1/events/mine": {
            get: {
                summary: "Get events created by you",
                tags: ['Events'],
                parameters: paginationQueryParams,
                responses: {
                    200: {
                        description: "A list of applied events",
                        content: {
                            'application/json': { schema: paginatedEventSchema }
                        }
                    },
                },
            },
        },
    }
};
