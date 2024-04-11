import { constructResponseSchema } from "./common.doc";

const newsArticlesSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            source: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' }
                },
                required: ['id', 'name']
            },
            author: { type: 'string' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            url: { type: 'string', format: 'uri' },
            urlToImage: { type: ['string', 'null'], format: 'uri' },
            publishedAt: { type: 'string', format: 'date-time' },
            content: { type: ['string', 'null'] }
        },
        required: ['source', 'author', 'title', 'url', 'publishedAt']
    }
};

export const thirdpartySwagger = {
    paths: {
        '/api/v1/trending': {
            get: {
                summary: 'Get Trending News/Events.',
                tags: ['Third Parties'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(newsArticlesSchema) },
                        },
                    },
                },
            },
        },
    }
}