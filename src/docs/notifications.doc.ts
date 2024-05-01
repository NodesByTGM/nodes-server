import { constructResponseSchema, notificationSchema, paginationQueryParams } from "./common.doc";

export const notificationSwagger = {
    paths: {
        '/api/v1/notifications/mine': {
            get: {
                summary: 'Get All Notifications',
                tags: ['Notifications'],
                security: [{ bearerAuth: [] }],
                parameters: paginationQueryParams,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(notificationSchema, true) }
                        }
                    },
                },
            },
        },

        '/api/v1/notifications/remove/{id}': {
            get: {
                summary: 'Get A Notification',
                tags: ['Notifications'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID of the notification to retrieve.',
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                    },
                },
            },
        },
    }
}