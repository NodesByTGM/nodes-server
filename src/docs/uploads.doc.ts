export const uploadMediaSwagger = {
    paths: {
        '/api/v1/uploads/media': {
            post: {
                summary: 'Upload Media for all kinds of things, this will return an id and link to the uploaded media.',
                tags: ['Uploads'],
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
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'string',
                                            description: 'Unique identifier for the uploaded media',
                                        },
                                        url: {
                                            type: 'string',
                                            description: 'URL to access the uploaded media',
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

// Schema for the "Delete Media" API endpoint
export const deleteMediaSwagger = {
    paths: {
        '/api/v1/uploads/media/delete/{id}': {
            delete: {
                summary: 'Delete Media that has been uploaded using the id of the uploaded media.',
                tags: ['Uploads'],
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
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'number',
                                            description: 'HTTP status code (200 for success)',
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
