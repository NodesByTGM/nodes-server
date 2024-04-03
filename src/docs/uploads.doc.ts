import { constructResponseSchema, trueFileSwaggerSchema } from "./common.doc";

export const mediaSwagger = {
    paths: {
        '/api/v1/uploads/media': {
            post: {
                summary: 'Upload Media for all kinds of things, this will return an id and link to the uploaded media.',
                tags: ['Uploads'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    file: {
                                        type: 'string',
                                        format: 'binary',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(trueFileSwaggerSchema) },
                        },
                    },
                },
            },
        },
        '/api/v1/uploads/media/delete/{id}': {
            delete: {
                summary: 'Delete Media that has been uploaded using the id of the uploaded media.',
                tags: ['Uploads'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'Unique identifier for the media to be deleted',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        // content: {
                        //     'application/json': { schema: constructResponseSchema(trueFileSwaggerSchema) },
                        // },
                    },
                },
            },
        },
    }
}