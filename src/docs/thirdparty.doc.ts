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

const trendingMediaSchema = {
    type: 'object',
    properties: {
        page: { type: 'number' },
        results: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    backdrop_path: { type: 'string' },
                    id: { type: 'number' },
                    original_name: { type: ['string', 'undefined'] },
                    overview: { type: 'string' },
                    poster_path: { type: 'string' },
                    media_type: { type: 'string' },
                    adult: { type: 'boolean' },
                    name: { type: ['string', 'undefined'] },
                    original_language: { type: 'string' },
                    genre_ids: {
                        type: 'array',
                        items: { type: 'number' }
                    },
                    popularity: { type: 'number' },
                    first_air_date: { type: ['string', 'undefined'] },
                    vote_average: { type: 'number' },
                    vote_count: { type: 'number' },
                    origin_country: {
                        type: ['array', 'undefined'],
                        items: { type: 'string' }
                    },
                    original_title: { type: ['string', 'undefined'] },
                    title: { type: ['string', 'undefined'] },
                    release_date: { type: ['string', 'undefined'] },
                    video: { type: ['boolean', 'undefined'] }
                },
                required: [
                    'backdrop_path',
                    'id',
                    'overview',
                    'poster_path',
                    'media_type',
                    'adult',
                    'original_language',
                    'genre_ids',
                    'popularity',
                    'vote_average',
                    'vote_count'
                ]
            }
        },
        total_pages: { type: 'number' },
        total_results: { type: 'number' }
    },
    required: ['page', 'results', 'total_pages', 'total_results']
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
        '/api/v1/movies-and-shows': {
            get: {
                summary: 'Get Trending Movies and TV shows.',
                tags: ['Third Parties'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': { schema: constructResponseSchema(trendingMediaSchema) },
                        },
                    },
                },
            },
        },
    }
}
