import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nodes API',
            version: '1.0.0',
            description: 'API documentation for Nodes Server',
        },
    },
    apis: ['**/*.ts'], // Path to the API routes
};
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec