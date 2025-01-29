import swaggerJSDoc from 'swagger-jsdoc';
import swaggerAutogen from "swagger-autogen";

const options = {
    definition: {
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
    },
    apis: ["./src/routes/*.ts"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/index.ts", "./src/routes/*.ts"];

swaggerAutogen()(outputFile, endpointsFiles).then(() => {
    console.log("Swagger json created");
});

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec};