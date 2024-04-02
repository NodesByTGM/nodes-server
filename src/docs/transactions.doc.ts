import { constructResponseSchema, userSchema } from "./common.doc";


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
export const transactionSwagger = {
    paths: {
        // '/verify': {
        //     get: {
        //         summary: 'Verify Transaction for Payment Gateway callbacks',
        //         tags: ['Transactions'],
        //         parameters: transactionQueryParams,
        //         description: 'Endpoint to verify transaction',
        //         responses: {
        //             '200': {
        //                 description: 'OK',
        //             },
        //         },
        //     },
        // },
        '/verify/internal': {
            get: {
                summary: 'Verify Internal Transaction',
                tags: ['Transactions'],
                parameters: transactionQueryParams,
                description: 'Endpoint to verify internal transaction',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
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
