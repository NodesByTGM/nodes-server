import { constructResponseSchema, transactionSchema, userSchema } from "./common.doc";


export const transactionQueryParams = [
    {
        name: 'reference',
        in: 'query',
        description: 'Transaction Reference',
        required: false,
        schema: {
            type: 'string',
            default: "jhgfcjkhjnld"
        }
    },
]

const initiateSubscriptionRequestBody = {
    type: 'object',
    properties: {
        planKey: { type: 'string' },
        reference: { type: 'string' },
        callback_url: { type: 'string' },
        metadata: { type: 'object', example: { cancel_action: '' } },
    }
};
const initiateSubscriptionResponse = {
    type: 'object',
    properties: {
        authorization_url: { type: 'string' },
        access_code: { type: 'string' },
        reference: { type: 'string' },
    }
};
// TODO eliminate tag strings
export const transactionSwagger = {
    paths: {
        '/api/v1/transactions/mine': {
            get: {
                summary: 'Get User\'s Transactions',
                tags: ['Transactions'],
                parameters: transactionQueryParams,
                description: 'Get User\'s Transactions',
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(transactionSchema, true) }
                        }
                    },
                },
            },
        },
        '/api/v1/transactions/verify/internal': {
            get: {
                summary: 'Verify Internal Transaction',
                tags: ['Transactions'],
                parameters: transactionQueryParams,
                description: 'Endpoint to verify internal transaction',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(userSchema) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/api/v1/transactions/subscription/initiate': {
            post: {
                summary: 'Initiate Subscription Payment',
                tags: ['Transactions'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: initiateSubscriptionRequestBody,
                        },
                    },
                },
                description: 'Endpoint to verify internal transaction',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': { schema: constructResponseSchema(initiateSubscriptionResponse) }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                    '400': {
                        description: 'BadRequestError',
                    },
                },
            },
        },
        // '/webhook/paystack': {
        //     post: {
        //         summary: 'Paystack Webhook',
        //         tags: ['Transactions'],
        //         description: 'Endpoint for Paystack webhook',
        //         responses: {
        //             '200': {
        //                 description: 'OK',
        //             },
        //         },
        //     },
        // },
    },
};
