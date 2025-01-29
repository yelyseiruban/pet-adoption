import { SwaggerOptions, serve, setup } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Pet Adoption API',
        version: '1.0.0',
        description: 'This is a simple API for managing pets in a shelter.',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
};

const options: SwaggerOptions = {
    swaggerDefinition,
    apis: ['../../routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, serve, setup };